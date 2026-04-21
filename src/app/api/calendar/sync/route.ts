import { syncSessionToCalendar } from '@/lib/session-sync'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type SyncRequest = {
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

  const body = (await request.json()) as SyncRequest
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  const [{ data: profile }, { data: session }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    service
      .from('sessions')
      .select('id, tutor_id, student_id')
      .eq('id', body.sessionId)
      .single(),
  ])

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const isAdmin = profile?.role === 'admin'
  const isParticipant = session.student_id === user.id || session.tutor_id === user.id
  if (!isAdmin && !isParticipant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const result = await syncSessionToCalendar(service, session.id)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Calendar sync failed' },
      { status: 500 }
    )
  }
}
