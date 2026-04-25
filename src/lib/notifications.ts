// @ts-nocheck
import { createClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'session_booking_request'
  | 'session_confirmed'
  | 'session_cancelled'
  | 'session_reminder_1h'
  | 'payment_request'
  | 'message_received'
  | 'parent_link_request'
  | 'tutor_approved'
  | 'review_request'

export async function createNotification({
  userId,
  type,
  title,
  body,
  data
}: {
  userId: string
  type: NotificationType
  title: string
  body?: string
  data?: Record<string, unknown>
}) {
  const supabase = await createClient()
  await supabase.from('notifications').insert({ user_id: userId, type, title, body, data })
}
