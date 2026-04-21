import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ studentId: string }>
}

export default async function TutorChatRoomPage({ params }: Props) {
  const { studentId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: room } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('tutor_id', user.id)
    .eq('student_id', studentId)
    .maybeSingle()

  if (!room) {
    return <div className="card" style={{ padding: '1rem' }}>No chat room found for this student.</div>
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, content, created_at')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true })
    .limit(200)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Conversation</h1>
      <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.5rem' }}>
        {(messages ?? []).map((message) => (
          <div key={message.id} style={{ padding: '0.625rem', borderRadius: '8px', background: 'var(--surface-hover)' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{message.content ?? '(attachment)'}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {new Date(message.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        ))}
        {!(messages ?? []).length && <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p>}
      </div>
    </div>
  )
}