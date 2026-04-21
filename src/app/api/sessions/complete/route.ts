import { capturePayment } from '@/lib/payments'
import { emails } from '@/lib/email'
import { createNotification } from '@/lib/notifications'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type CompleteRequest = {
  sessionId?: string
  actualStart?: string
  actualEnd?: string
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

  const body = (await request.json()) as CompleteRequest
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const [{ data: actorProfile }, { data: session }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    service
      .from('sessions')
      .select('id, tutor_id, student_id, status, scheduled_start, scheduled_end, actual_start, actual_end')
      .eq('id', body.sessionId)
      .single(),
  ])

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const isTutor = session.tutor_id === user.id
  const isAdmin = actorProfile?.role === 'admin'
  if (!isTutor && !isAdmin) {
    return NextResponse.json(
      { error: 'Only session tutor or admin can complete this session' },
      { status: 403 }
    )
  }

  if (session.status !== 'confirmed') {
    return NextResponse.json(
      { error: 'Only confirmed sessions can be marked completed' },
      { status: 400 }
    )
  }

  const { data: transaction } = await service
    .from('transactions')
    .select('id, status, gateway_transaction_id')
    .eq('session_id', session.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!transaction) {
    return NextResponse.json(
      { error: 'No transaction exists for this session' },
      { status: 400 }
    )
  }

  if (transaction.status === 'authorized') {
    if (!transaction.gateway_transaction_id) {
      return NextResponse.json(
        { error: 'Missing authorization id for capture' },
        { status: 400 }
      )
    }

    const captureResult = await capturePayment({
      authorizationId: transaction.gateway_transaction_id,
    })

    if (!captureResult.success) {
      return NextResponse.json(
        { error: captureResult.error ?? 'Payment capture failed' },
        { status: 400 }
      )
    }

    const { error: txUpdateError } = await service
      .from('transactions')
      .update({
        status: 'captured',
        gateway_response: {
          capturedTransactionId: captureResult.transactionId,
        },
      })
      .eq('id', transaction.id)

    if (txUpdateError) {
      return NextResponse.json({ error: txUpdateError.message }, { status: 400 })
    }
  } else if (transaction.status !== 'captured') {
    return NextResponse.json(
      { error: `Transaction is in unsupported state: ${transaction.status}` },
      { status: 400 }
    )
  }

  const actualStart = body.actualStart ?? session.actual_start ?? session.scheduled_start
  const actualEnd = body.actualEnd ?? session.actual_end ?? new Date().toISOString()

  const { error: sessionUpdateError } = await service
    .from('sessions')
    .update({
      status: 'completed',
      actual_start: actualStart,
      actual_end: actualEnd,
    })
    .eq('id', session.id)

  if (sessionUpdateError) {
    return NextResponse.json({ error: sessionUpdateError.message }, { status: 400 })
  }

  await Promise.all([
    createNotification({
      userId: session.student_id,
      type: 'session_confirmed',
      title: 'Session marked complete',
      body: 'Your session has been marked completed.',
      data: { sessionId: session.id, status: 'completed' },
    }),
    createNotification({
      userId: session.tutor_id,
      type: 'session_confirmed',
      title: 'Session marked complete',
      body: 'Session completion and payment capture finished successfully.',
      data: { sessionId: session.id, status: 'completed' },
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
      .from('sessions')
      .select('subject_id, scheduled_start')
      .eq('id', session.id)
      .single(),
  ])

  const subjectRecord = subject?.subject_id
    ? await service
        .from('subjects')
        .select('name')
        .eq('id', subject.subject_id)
        .maybeSingle()
    : { data: null }

  const subjectName = subjectRecord.data?.name ?? 'Tutoring Session'
  const sessionDate = new Date(subject?.scheduled_start ?? new Date().toISOString()).toLocaleString(
    'en-PK',
    { dateStyle: 'medium', timeStyle: 'short' }
  )

  if (student?.email && student?.full_name) {
    void emails.sessionCompleted(
      student.email,
      student.full_name,
      subjectName,
      sessionDate,
      `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/student/sessions`
    )
  }

  if (tutor?.email && tutor?.full_name) {
    void emails.sessionCompleted(
      tutor.email,
      tutor.full_name,
      subjectName,
      sessionDate,
      `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/tutor/earnings`
    )
  }

  return NextResponse.json({ success: true, sessionId: session.id, status: 'completed' })
}
