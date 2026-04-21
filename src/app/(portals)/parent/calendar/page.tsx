import { redirect } from 'next/navigation'
import SessionStatusBadge from '@/components/shared/SessionStatusBadge'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'
import type { SessionStatus } from '@/types'

export default async function ParentCalendarPage() {
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

  const safeLinks = (links ?? []) as Array<{ student_id: string }>

  const studentIds = safeLinks.map((link) => link.student_id)

  if (!studentIds.length) {
    return (
      <div className="card" style={{ padding: '1.25rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Child Calendar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          No linked student accounts found yet.
        </p>
      </div>
    )
  }

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, student_id, tutor_id, subject_id, status, scheduled_start, scheduled_end')
    .in('student_id', studentIds)
    .order('scheduled_start', { ascending: true })
    .limit(80)

  const safeSessions = (sessions ?? []) as Array<{
    id: string
    student_id: string
    tutor_id: string
    subject_id?: string | null
    status: string
    scheduled_start: string
    scheduled_end: string
  }>

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Child Calendar</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const tutorIds = Array.from(new Set(safeSessions.map((session) => session.tutor_id)))
  const subjectIds = Array.from(
    new Set(safeSessions.map((session) => session.subject_id).filter(Boolean))
  ) as string[]

  const [{ data: tutorRows }, { data: studentRows }, { data: subjectRows }] = await Promise.all([
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    subjectIds.length
      ? supabase.from('subjects').select('id, name').in('id', subjectIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const safeTutorRows = (tutorRows ?? []) as Array<{ id: string; full_name?: string | null }>
  const safeStudentRows = (studentRows ?? []) as Array<{ id: string; full_name?: string | null }>
  const safeSubjectRows = (subjectRows ?? []) as Array<{ id: string; name?: string | null }>

  const tutorMap = new Map(safeTutorRows.map((row) => [row.id, row.full_name]))
  const studentMap = new Map(safeStudentRows.map((row) => [row.id, row.full_name]))
  const subjectMap = new Map(safeSubjectRows.map((row) => [row.id, row.name]))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Child Calendar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Monitor upcoming and completed sessions for your linked children.
        </p>
      </div>

      {!safeSessions.length ? (
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No sessions available yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Tutor</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {safeSessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ fontWeight: 600 }}>{studentMap.get(session.student_id) ?? 'Student'}</td>
                  <td>{tutorMap.get(session.tutor_id) ?? 'Tutor'}</td>
                  <td>{subjectMap.get(session.subject_id ?? '') ?? 'General'}</td>
                  <td>
                    <div>{formatDateTime(session.scheduled_start)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Ends {formatDateTime(session.scheduled_end)}
                    </div>
                  </td>
                  <td>
                    <SessionStatusBadge status={session.status as SessionStatus} />
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
