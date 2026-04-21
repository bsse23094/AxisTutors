import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TutorStudentDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: student } = await supabase
    .from('profiles')
    .select('id, full_name, email, city, province')
    .eq('id', id)
    .eq('role', 'student')
    .maybeSingle()

  if (!student) {
    notFound()
  }

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, status, scheduled_start, scheduled_end, total_amount')
    .eq('tutor_id', user.id)
    .eq('student_id', id)
    .order('scheduled_start', { ascending: false })
    .limit(50)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{student.full_name}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        {student.email} · {[student.city, student.province].filter(Boolean).join(', ') || 'Pakistan'}
      </p>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(sessions ?? []).map((session) => (
              <tr key={session.id}>
                <td>{new Date(session.scheduled_start).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td><span className="badge badge-info">{session.status}</span></td>
                <td>PKR {Number(session.total_amount ?? 0).toLocaleString()}</td>
              </tr>
            ))}
            {!(sessions ?? []).length && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No sessions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
