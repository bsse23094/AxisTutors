import Link from 'next/link'
import { redirect } from 'next/navigation'
import SessionStatusBadge from '@/components/shared/SessionStatusBadge'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'

export default async function StudentCalendarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: sessions, error }, { data: studentProfile }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, tutor_id, subject_id, scheduled_start, scheduled_end, status, session_link')
      .eq('student_id', user.id)
      .in('status', ['confirmed', 'completed'])
      .order('scheduled_start', { ascending: true }),
    supabase
      .from('student_profiles')
      .select('google_refresh_token')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Calendar</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const tutorIds = Array.from(new Set((sessions ?? []).map((session) => session.tutor_id)))
  const subjectIds = Array.from(
    new Set((sessions ?? []).map((session) => session.subject_id).filter(Boolean))
  ) as string[]

  const [{ data: tutorRows }, { data: subjectRows }] = await Promise.all([
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    subjectIds.length
      ? supabase.from('subjects').select('id, name').in('id', subjectIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const tutorMap = new Map((tutorRows ?? []).map((row) => [row.id, row.full_name]))
  const subjectMap = new Map((subjectRows ?? []).map((row) => [row.id, row.name]))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Calendar</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Confirmed and completed sessions with calendar connectivity.
          </p>
        </div>
        <a href="/api/auth/google/connect" className="btn btn-secondary btn-sm">
          {studentProfile?.google_refresh_token ? 'Reconnect Google Calendar' : 'Connect Google Calendar'}
        </a>
      </div>

      {!sessions?.length ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            No confirmed sessions yet.
          </p>
          <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
            Find a Tutor
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Time</th>
                <th>Status</th>
                <th>Meeting</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{subjectMap.get(session.subject_id ?? '') ?? 'General Session'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Tutor: {tutorMap.get(session.tutor_id) ?? 'Tutor'}
                    </div>
                  </td>
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
