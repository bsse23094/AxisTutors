import { authorizePayment } from '@/lib/payments'
import { emails } from '@/lib/email'
import { createNotification } from '@/lib/notifications'
import { syncSessionToCalendar } from '@/lib/session-sync'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type AuthorizeRequest = {
  sessionId?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const service = await createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!parentProfile || parentProfile.role !== 'parent') {
    return NextResponse.json(
      { error: 'Only parents can authorize payment' },
      { status: 403 }
    )
  }

  const body = (await request.json()) as AuthorizeRequest
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const { data: session } = await service
    .from('sessions')
    .select('id, tutor_id, student_id, subject_id, scheduled_start, total_amount, platform_fee, tutor_payout, status')
    .eq('id', body.sessionId)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.status !== 'pending_payment') {
    return NextResponse.json(
      { error: 'Session is not awaiting payment approval' },
      { status: 400 }
    )
  }

  const { data: link } = await supabase
    .from('parent_student_links')
    .select('id')
    .eq('parent_id', user.id)
    .eq('student_id', session.student_id)
    .eq('status', 'approved')
    .maybeSingle()

  if (!link) {
    return NextResponse.json(
      { error: 'Parent is not linked to this student' },
      { status: 403 }
    )
  }

  const { data: parentPaymentProfile } = await service
    .from('parent_profiles')
    .select('payment_customer_id')
    .eq('id', user.id)
    .maybeSingle()

  const customerId = parentPaymentProfile?.payment_customer_id ?? `parent_${user.id}`

  const result = await authorizePayment({
    amount: Math.round(Number(session.total_amount) * 100),
    currency: 'PKR',
    customerId,
    sessionId: session.id,
    description: `Session ${session.id}`,
  })

  if (!result.success || !result.authorizationId) {
    return NextResponse.json(
      { error: result.error ?? 'Payment authorization failed' },
      { status: 400 }
    )
  }

  const { error: txError } = await service.from('transactions').insert({
    session_id: session.id,
    parent_id: user.id,
    student_id: session.student_id,
    tutor_id: session.tutor_id,
    amount: session.total_amount,
    platform_fee: session.platform_fee,
    tutor_payout: session.tutor_payout,
    status: 'authorized',
    payment_gateway: 'mock',
    gateway_transaction_id: result.authorizationId,
    gateway_response: { authorizationId: result.authorizationId },
  })

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 400 })
  }

  const { error: sessionUpdateError } = await service
    .from('sessions')
    .update({ status: 'confirmed' })
    .eq('id', session.id)

  if (sessionUpdateError) {
    return NextResponse.json({ error: sessionUpdateError.message }, { status: 400 })
  }

  let calendarSyncWarning: string | undefined
  try {
    const syncResult = await syncSessionToCalendar(service, session.id)
    if (!syncResult.synced && syncResult.reason) {
      calendarSyncWarning = syncResult.reason
    }
  } catch (error) {
    calendarSyncWarning =
      error instanceof Error ? error.message : 'Calendar sync failed unexpectedly'
  }

  await Promise.all([
    createNotification({
      userId: session.student_id,
      type: 'session_confirmed',
      title: 'Session confirmed',
      body: 'Your parent approved payment. The session is now confirmed.',
      data: { sessionId: session.id },
    }),
    createNotification({
      userId: session.tutor_id,
      type: 'session_confirmed',
      title: 'Session confirmed',
      body: 'A booked session has been approved and confirmed.',
      data: { sessionId: session.id },
    }),
  ])

  const [{ data: tutor }, { data: student }, { data: subject }] = await Promise.all([
    service
      .from('profiles')
      .select('full_name, email')
      .eq('id', session.tutor_id)
      .single(),
    service
      .from('profiles')
      .select('full_name, email')
      .eq('id', session.student_id)
      .single(),
    service
      .from('subjects')
      .select('name')
      .eq('id', session.subject_id as string)
      .maybeSingle(),
  ])

  const subjectName = subject?.name ?? 'Tutoring Session'
  const sessionDate = new Date(session.scheduled_start).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const sessionLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/student/sessions`

  // Best-effort email delivery should not block core transaction flow.
  if (student?.email && student?.full_name && tutor?.full_name) {
    void emails.sessionConfirmed(
      student.email,
      student.full_name,
      subjectName,
      sessionDate,
      sessionLink
    )
  }

  if (tutor?.email && tutor?.full_name) {
    void emails.sessionConfirmed(
      tutor.email,
      tutor.full_name,
      subjectName,
      sessionDate,
      `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/tutor/calendar`
    )
  }

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    status: 'confirmed',
    calendarSyncWarning,
  })
}
