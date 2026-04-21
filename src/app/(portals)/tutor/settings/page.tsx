import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function TutorSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: tutorProfile }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, phone, timezone, city, province')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('tutor_profiles')
      .select('google_refresh_token, google_calendar_id')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Account, integrations, and tutor preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Account Details</h3>
          <div style={{ display: 'grid', gap: '0.625rem', fontSize: '0.875rem' }}>
            <div><strong>Name:</strong> {profile?.full_name ?? '-'}</div>
            <div><strong>Email:</strong> {profile?.email ?? '-'}</div>
            <div><strong>Phone:</strong> {profile?.phone ?? '-'}</div>
            <div><strong>Timezone:</strong> {profile?.timezone ?? 'Asia/Karachi'}</div>
            <div><strong>Location:</strong> {[profile?.city, profile?.province].filter(Boolean).join(', ') || '-'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Google Calendar</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>
            {tutorProfile?.google_refresh_token
              ? 'Connected. Your confirmed sessions can sync to calendar.'
              : 'Not connected yet. Connect to automatically sync sessions.'}
          </p>
          <a href="/api/auth/google/connect" className="btn btn-secondary btn-sm">
            {tutorProfile?.google_refresh_token ? 'Reconnect Calendar' : 'Connect Calendar'}
          </a>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Security</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>
            Password and sign-in security are managed by Supabase Auth.
          </p>
          <a href="/forgot-password" className="btn btn-secondary btn-sm">
            Reset Password
          </a>
        </div>
      </div>
    </div>
  )
}
