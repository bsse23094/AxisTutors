import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: actor } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const actorRole = (actor as { role?: string } | null)?.role
  if (actorRole !== 'admin') {
    redirect('/login')
  }

  const [profilesRes, tutorsRes, sessionsRes, txRes] = await Promise.all([
    supabase.from('profiles').select('id, role, created_at'),
    supabase.from('tutor_profiles').select('id, is_approved'),
    supabase.from('sessions').select('id, status, created_at'),
    supabase.from('transactions').select('id, amount, status, created_at'),
  ])

  const profiles = (profilesRes.data ?? []) as Array<{ created_at?: string | null }>
  const tutors = (tutorsRes.data ?? []) as Array<{ is_approved?: boolean | null }>
  const sessions = (sessionsRes.data ?? []) as Array<{ status?: string | null }>
  const tx = (txRes.data ?? []) as Array<{ status?: string | null; amount?: number | string | null }>

  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)

  const newUsersThisMonth = profiles.filter((row) => row.created_at && new Date(row.created_at) >= thisMonthStart).length
  const approvedTutors = tutors.filter((row) => row.is_approved).length
  const completionRate = sessions.length
    ? Math.round((sessions.filter((s) => s.status === 'completed').length / sessions.length) * 100)
    : 0
  const capturedRevenue = tx
    .filter((row) => row.status === 'captured')
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          High-level platform growth and delivery metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}><strong>Total Users:</strong> {profiles.length}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>New Users (Month):</strong> {newUsersThisMonth}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Approved Tutors:</strong> {approvedTutors}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Sessions:</strong> {sessions.length}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Completion Rate:</strong> {completionRate}%</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Captured Revenue:</strong> PKR {capturedRevenue.toLocaleString()}</div>
      </div>
    </div>
  )
}
