import { createNotification, type NotificationType } from '@/lib/notifications'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type NotificationRequest = {
  userId?: string
  type?: NotificationType
  title?: string
  body?: string
  data?: Record<string, unknown>
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const body = (await request.json()) as NotificationRequest

  if (!body.userId || !body.type || !body.title) {
    return NextResponse.json(
      { error: 'userId, type, and title are required' },
      { status: 400 }
    )
  }

  const isSelf = body.userId === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isSelf && !isAdmin) {
    return NextResponse.json(
      { error: 'Only admins can send notifications to other users' },
      { status: 403 }
    )
  }

  await createNotification({
    userId: body.userId,
    type: body.type,
    title: body.title,
    body: body.body,
    data: body.data,
  })

  return NextResponse.json({ success: true })
}
