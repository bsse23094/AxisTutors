import { createNotification } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/server'
// @ts-nocheck
import { NextResponse } from 'next/server'

type BookRequest = {
  tutorId?: string
  subjectId?: string
  scheduledStart?: string
  scheduledEnd?: string
  sessionLink?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: actorProfile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!actorProfile || actorProfile.role !== 'student') {
    return NextResponse.json(
      { error: 'Only students can book sessions' },
      { status: 403 }
    )
  }

  const body = (await request.json()) as BookRequest
  if (!body.tutorId || !body.subjectId || !body.scheduledStart || !body.scheduledEnd) {
    return NextResponse.json(
      { error: 'Missing tutorId, subjectId, scheduledStart, or scheduledEnd' },
      { status: 400 }
    )
  }

  const start = new Date(body.scheduledStart)
  const end = new Date(body.scheduledEnd)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  if (!Number.isFinite(durationHours) || durationHours <= 0) {
    return NextResponse.json({ error: 'Invalid session time range' }, { status: 400 })
  }

  const { data: tutorProfile } = await supabase
    .from('tutor_profiles')
    .select('id, hourly_rate, is_approved')
    .eq('id', body.tutorId)
    .single()

  if (!tutorProfile || !tutorProfile.is_approved) {
    return NextResponse.json(
      { error: 'Tutor is not available for booking' },
      { status: 400 }
    )
  }

  const hourlyRate = Number(tutorProfile.hourly_rate)
  const totalAmount = Number((hourlyRate * durationHours).toFixed(2))
  const commission = Number(process.env.NEXT_PUBLIC_PLATFORM_COMMISSION ?? '0.15')
  const platformFee = Number((totalAmount * commission).toFixed(2))
  const tutorPayout = Number((totalAmount - platformFee).toFixed(2))

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      tutor_id: body.tutorId,
      student_id: user.id,
      subject_id: body.subjectId,
      status: 'pending_payment',
      scheduled_start: body.scheduledStart,
      scheduled_end: body.scheduledEnd,
      hourly_rate: hourlyRate,
      total_amount: totalAmount,
      platform_fee: platformFee,
      tutor_payout: tutorPayout,
      session_link: body.sessionLink ?? null,
    })
    .select('id')
    .single()

  if (sessionError || !session) {
    return NextResponse.json(
      { error: sessionError?.message ?? 'Failed to create session' },
      { status: 400 }
    )
  }

  const { data: existingRoom } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('tutor_id', body.tutorId)
    .eq('student_id', user.id)
    .maybeSingle()

  if (!existingRoom) {
    await supabase.from('chat_rooms').insert({
      tutor_id: body.tutorId,
      student_id: user.id,
    })
  }

  const { data: parentLinks } = await supabase
    .from('parent_student_links')
    .select('parent_id')
    .eq('student_id', user.id)
    .eq('status', 'approved')

  if (parentLinks?.length) {
    await Promise.all(
      parentLinks.map((link) =>
        createNotification({
          userId: link.parent_id,
          type: 'session_booking_request',
          title: 'Session booking approval needed',
          body: `${actorProfile.full_name} booked a session and needs your payment approval.`,
          data: { sessionId: session.id },
        })
      )
    )
  }

  return NextResponse.json({
    success: true,
    sessionId: session.id,
    status: 'pending_payment',
  })
}
