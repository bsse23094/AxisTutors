import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function StudentChatPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: rooms, error } = await supabase
    .from('chat_rooms')
    .select('id, tutor_id, created_at')
    .eq('student_id', user.id)
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
  const tutorIds = Array.from(new Set((rooms ?? []).map((room) => room.tutor_id)))

  const [{ data: tutors }, { data: messages }] = await Promise.all([
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    roomIds.length
      ? supabase
          .from('messages')
          .select('id, room_id, content, created_at')
          .in('room_id', roomIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ])

  const tutorMap = new Map((tutors ?? []).map((row) => [row.id, row.full_name]))
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
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Messages</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Active conversation threads with your tutors.
          </p>
        </div>
        <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
          Book a Tutor
        </Link>
      </div>

      {!rooms?.length ? (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            No conversations yet. Book a session to start chatting with a tutor.
          </p>
          <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
            Find Tutors
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
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
                    <td style={{ fontWeight: 600 }}>{tutorMap.get(room.tutor_id) ?? 'Tutor'}</td>
                    <td style={{ maxWidth: '26rem' }}>
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
