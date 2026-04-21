import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function hoursBetween(start: string, end: string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return diff > 0 ? diff / (1000 * 60 * 60) : 0
}

export default async function ParentReportsPage() {
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

  const studentIds = (links ?? []).map((row) => row.student_id)

  if (!studentIds.length) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Progress Reports</h1>
        <p style={{ color: 'var(--text-muted)' }}>No linked children yet.</p>
      </div>
    )
  }

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, student_id, subject_id, status, scheduled_start, scheduled_end')
    .in('student_id', studentIds)
    .eq('status', 'completed')
    .order('scheduled_start', { ascending: false })
    .limit(200)

  const subjectIds = Array.from(
    new Set((sessions ?? []).map((row) => row.subject_id).filter(Boolean))
  ) as string[]
  const { data: subjects } = subjectIds.length
    ? await supabase.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] as Array<{ id: string; name: string }> }
  const subjectMap = new Map((subjects ?? []).map((row) => [row.id, row.name]))

  const totalSessions = (sessions ?? []).length
  const totalHours = (sessions ?? []).reduce((sum, session) => sum + hoursBetween(session.scheduled_start, session.scheduled_end), 0)
  const bySubject = new Map<string, number>()
  for (const session of sessions ?? []) {
    const name = subjectMap.get(session.subject_id ?? '') ?? 'General'
    bySubject.set(name, (bySubject.get(name) ?? 0) + 1)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Progress Reports</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Learning activity across linked student accounts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}><strong>Completed Sessions:</strong> {totalSessions}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Total Hours:</strong> {totalHours.toFixed(1)}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Active Subjects:</strong> {bySubject.size}</div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Sessions by Subject</h2>
        {!bySubject.size ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No completed sessions yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {Array.from(bySubject.entries()).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-hover)', borderRadius: '8px', padding: '0.625rem 0.75rem' }}>
                <span>{name}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
