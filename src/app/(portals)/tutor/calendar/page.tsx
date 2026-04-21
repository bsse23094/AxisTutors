import { redirect } from 'next/navigation'
import SessionStatusBadge from '@/components/shared/SessionStatusBadge'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'

export default async function TutorCalendarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: sessions, error }, { data: tutorProfile }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, student_id, subject_id, status, scheduled_start, scheduled_end, session_link, google_event_id_tutor')
      .eq('tutor_id', user.id)
      .order('scheduled_start', { ascending: true })
      .limit(50),
    supabase
      .from('tutor_profiles')
      .select('google_refresh_token')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Calendar</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const studentIds = Array.from(new Set((sessions ?? []).map((session) => session.student_id)))
  const subjectIds = Array.from(
    new Set((sessions ?? []).map((session) => session.subject_id).filter(Boolean))
  ) as string[]

  const [{ data: studentRows }, { data: subjectRows }] = await Promise.all([
    studentIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    subjectIds.length
      ? supabase.from('subjects').select('id, name').in('id', subjectIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const studentMap = new Map((studentRows ?? []).map((row) => [row.id, row.full_name]))
  const subjectMap = new Map((subjectRows ?? []).map((row) => [row.id, row.name]))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Calendar</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            View your schedule and keep sessions synced with Google Calendar.
          </p>
        </div>
        <a href="/api/auth/google/connect" className="btn btn-secondary btn-sm">
          {tutorProfile?.google_refresh_token ? 'Reconnect Google Calendar' : 'Connect Google Calendar'}
        </a>
      </div>

      {!sessions?.length ? (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            No sessions scheduled yet.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Status</th>
                <th>Calendar</th>
                <th>Meeting</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ fontWeight: 600 }}>{studentMap.get(session.student_id) ?? 'Student'}</td>
                  <td>{subjectMap.get(session.subject_id ?? '') ?? 'General Session'}</td>
                  <td>
                    <div>{formatDateTime(session.scheduled_start)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Ends {formatDateTime(session.scheduled_end)}
                    </div>
                  </td>
                  <td>
                    <SessionStatusBadge status={session.status} />
                  </td>
                  <td>
                    {session.google_event_id_tutor ? (
                      <span className="badge badge-success">Synced</span>
                    ) : (
                      <span className="badge badge-warning">Not Synced</span>
                    )}
                  </td>
                  <td>
                    {session.session_link ? (
                      <a href={session.session_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        Open Link
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Not set</span>
                    )}
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
