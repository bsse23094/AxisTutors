import { createNotification } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type CancelRequest = {
  sessionId?: string
  reason?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as CancelRequest
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('id, tutor_id, student_id, status')
    .eq('id', body.sessionId)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const isStudent = session.student_id === user.id
  const isTutor = session.tutor_id === user.id
  if (!isStudent && !isTutor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const newStatus = isStudent ? 'cancelled_student' : 'cancelled_tutor'
  const { error } = await supabase
    .from('sessions')
    .update({
      status: newStatus,
      cancellation_reason: body.reason ?? null,
      cancelled_by: user.id,
    })
    .eq('id', body.sessionId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const targetUserId = isStudent ? session.tutor_id : session.student_id
  await createNotification({
    userId: targetUserId,
    type: 'session_cancelled',
    title: 'Session cancelled',
    body: `A session has been cancelled${body.reason ? `: ${body.reason}` : '.'}`,
    data: { sessionId: session.id, status: newStatus },
  })

  return NextResponse.json({ success: true, status: newStatus })
}
