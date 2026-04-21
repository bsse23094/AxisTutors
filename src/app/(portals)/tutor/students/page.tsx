import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getDurationHours(start: string, end: string): number {
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  const diff = (endTime - startTime) / (1000 * 60 * 60)
  return Number.isFinite(diff) && diff > 0 ? diff : 0
}

export default async function TutorStudentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, student_id, status, scheduled_start, scheduled_end')
    .eq('tutor_id', user.id)
    .order('scheduled_start', { ascending: false })
    .limit(200)

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Students</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const studentIds = Array.from(new Set((sessions ?? []).map((session) => session.student_id)))
  const { data: studentRows } = studentIds.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', studentIds)
    : { data: [] as Array<{ id: string; full_name: string; email: string }> }

  const studentMap = new Map((studentRows ?? []).map((row) => [row.id, row]))

  const statsByStudent = new Map<
    string,
    {
      sessions: number
      completed: number
      hours: number
      lastSessionAt: string
    }
  >()

  for (const session of sessions ?? []) {
    const existing = statsByStudent.get(session.student_id) ?? {
      sessions: 0,
      completed: 0,
      hours: 0,
      lastSessionAt: session.scheduled_start,
    }

    existing.sessions += 1
    if (session.status === 'completed') {
      existing.completed += 1
    }
    existing.hours += getDurationHours(session.scheduled_start, session.scheduled_end)
    if (new Date(session.scheduled_start) > new Date(existing.lastSessionAt)) {
      existing.lastSessionAt = session.scheduled_start
    }

    statsByStudent.set(session.student_id, existing)
  }

  const students = Array.from(statsByStudent.entries())
    .map(([studentId, stats]) => ({
      studentId,
      profile: studentMap.get(studentId),
      stats,
    }))
    .sort((a, b) => b.stats.sessions - a.stats.sessions)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Students</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Active roster generated from your booked sessions.
        </p>
      </div>

      {!students.length ? (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            No student records yet. Students will appear here once they book sessions with you.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Total Sessions</th>
                <th>Completed</th>
                <th>Hours Taught</th>
                <th>Last Session</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item) => (
                <tr key={item.studentId}>
                  <td style={{ fontWeight: 600 }}>{item.profile?.full_name ?? 'Student'}</td>
                  <td>{item.profile?.email ?? '-'}</td>
                  <td>{item.stats.sessions}</td>
                  <td>{item.stats.completed}</td>
                  <td>{item.stats.hours.toFixed(1)}</td>
                  <td>
                    {new Date(item.stats.lastSessionAt).toLocaleDateString('en-PK', {
                      dateStyle: 'medium',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
