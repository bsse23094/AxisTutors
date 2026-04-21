import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ParentChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: links } = await supabase
    .from('parent_student_links')
    .select('student_id')
    .eq('parent_id', user.id)
    .eq('status', 'approved')

  const studentIds = (links ?? []).map((link) => link.student_id)
  if (!studentIds.length) {
    return (
      <div className="card" style={{ padding: '1.25rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Messages</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          No linked students found yet.
        </p>
      </div>
    )
  }

  const { data: rooms, error } = await supabase
    .from('chat_rooms')
    .select('id, student_id, tutor_id, created_at')
    .in('student_id', studentIds)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Messages</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const roomIds = (rooms ?? []).map((room) => room.id)
  const userIds = Array.from(
    new Set((rooms ?? []).flatMap((room) => [room.student_id, room.tutor_id]))
  )

  const [{ data: profiles }, { data: messages }] = await Promise.all([
    userIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', userIds)
      : Promise.resolve({ data: [], error: null }),
    roomIds.length
      ? supabase
          .from('messages')
          .select('id, room_id, content, created_at')
          .in('room_id', roomIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ])

  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row.full_name]))
  const latestByRoom = new Map<string, { content: string | null; created_at: string }>()

  for (const message of messages ?? []) {
    if (!latestByRoom.has(message.room_id)) {
      latestByRoom.set(message.room_id, {
        content: message.content,
        created_at: message.created_at,
      })
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Messages</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Read-only conversation oversight for linked student accounts.
        </p>
      </div>

      {!rooms?.length ? (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            No conversations found yet.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Tutor</th>
                <th>Latest Message</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const latest = latestByRoom.get(room.id)
                return (
                  <tr key={room.id}>
                    <td style={{ fontWeight: 600 }}>{profileMap.get(room.student_id) ?? 'Student'}</td>
                    <td>{profileMap.get(room.tutor_id) ?? 'Tutor'}</td>
                    <td style={{ maxWidth: '24rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                        }}
                      >
                        {latest?.content ?? 'No messages yet'}
                      </span>
                    </td>
                    <td>
                      {latest
                        ? new Date(latest.created_at).toLocaleString('en-PK', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
