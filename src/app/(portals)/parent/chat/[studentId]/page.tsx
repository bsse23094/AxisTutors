import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ studentId: string }>
}

export default async function ParentStudentChatPage({ params }: Props) {
  const { studentId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: link } = await supabase
    .from('parent_student_links')
    .select('id')
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .eq('status', 'approved')
    .maybeSingle()

  if (!link) {
    return <div className="card" style={{ padding: '1rem' }}>You are not linked to this student.</div>
  }

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('id, tutor_id, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  const tutorIds = Array.from(new Set((rooms ?? []).map((room) => room.tutor_id)))
  const { data: tutors } = tutorIds.length
    ? await supabase.from('profiles').select('id, full_name').in('id', tutorIds)
    : { data: [] as Array<{ id: string; full_name: string }> }

  const tutorMap = new Map((tutors ?? []).map((row) => [row.id, row.full_name]))

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Student Conversations</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Tutor</th>
              <th>Room</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {(rooms ?? []).map((room) => (
              <tr key={room.id}>
                <td>{tutorMap.get(room.tutor_id) ?? 'Tutor'}</td>
                <td>{room.id.slice(0, 8)}...</td>
                <td>{new Date(room.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</td>
              </tr>
            ))}
            {!(rooms ?? []).length && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No conversations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
