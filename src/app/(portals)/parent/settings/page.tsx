import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ParentSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: parentProfile }, { data: links }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, phone, city, province, country, timezone')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('parent_profiles')
      .select('monthly_budget, payment_customer_id')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('parent_student_links')
      .select('id, status')
      .eq('parent_id', user.id),
  ])

  const linkedChildren = (links ?? []).filter((row) => row.status === 'approved').length
  const pendingLinks = (links ?? []).filter((row) => row.status === 'pending').length

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Parent account and oversight preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Profile</h2>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div><strong>Name:</strong> {profile?.full_name ?? '-'}</div>
            <div><strong>Email:</strong> {profile?.email ?? '-'}</div>
            <div><strong>Phone:</strong> {profile?.phone ?? '-'}</div>
            <div><strong>Location:</strong> {[profile?.city, profile?.province, profile?.country].filter(Boolean).join(', ') || '-'}</div>
            <div><strong>Timezone:</strong> {profile?.timezone ?? 'Asia/Karachi'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Payments</h2>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div><strong>Monthly Budget:</strong> {parentProfile?.monthly_budget ? `PKR ${Number(parentProfile.monthly_budget).toLocaleString()}` : '-'}</div>
            <div><strong>Customer ID:</strong> {parentProfile?.payment_customer_id ?? 'Not linked'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Linked Children</h2>
          <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div><strong>Approved Links:</strong> {linkedChildren}</div>
            <div><strong>Pending Requests:</strong> {pendingLinks}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
