import Link from 'next/link'
import { redirect } from 'next/navigation'
import SessionStatusBadge from '@/components/shared/SessionStatusBadge'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default async function StudentSessionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(
      'id, tutor_id, subject_id, status, scheduled_start, scheduled_end, total_amount, session_link'
    )
    .eq('student_id', user.id)
    .order('scheduled_start', { ascending: true })

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Sessions</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const tutorIds = Array.from(new Set((sessions ?? []).map((session) => session.tutor_id)))
  const subjectIds = Array.from(
    new Set((sessions ?? []).map((session) => session.subject_id).filter(Boolean))
  ) as string[]

  const [{ data: tutors }, { data: subjects }] = await Promise.all([
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    subjectIds.length
      ? supabase.from('subjects').select('id, name').in('id', subjectIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const tutorMap = new Map((tutors ?? []).map((row) => [row.id, row.full_name]))
  const subjectMap = new Map((subjects ?? []).map((row) => [row.id, row.name]))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Sessions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track upcoming, completed, and pending sessions.
          </p>
        </div>
        <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
          Book New Session
        </Link>
      </div>

      {!sessions?.length ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            You do not have any sessions yet.
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
                <th>Subject</th>
                <th>Start</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ fontWeight: 600 }}>{tutorMap.get(session.tutor_id) ?? 'Tutor'}</td>
                  <td>{subjectMap.get(session.subject_id ?? '') ?? 'General'}</td>
                  <td>{formatDateTime(session.scheduled_start)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(Number(session.total_amount ?? 0))}</td>
                  <td>
                    <SessionStatusBadge status={session.status} />
                  </td>
                  <td>
                    {session.session_link ? (
                      <a
                        href={session.session_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        Join
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No link yet</span>
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
