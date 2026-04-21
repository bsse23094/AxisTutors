import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function StudentSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: studentProfile }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, phone, city, province, country, timezone')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('student_profiles')
      .select('grade_level, parent_phone, google_refresh_token')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Your profile details and integrations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Account</h3>
          <div style={{ display: 'grid', gap: '0.625rem', fontSize: '0.875rem' }}>
            <div><strong>Name:</strong> {profile?.full_name ?? '-'}</div>
            <div><strong>Email:</strong> {profile?.email ?? '-'}</div>
            <div><strong>Phone:</strong> {profile?.phone ?? '-'}</div>
            <div><strong>Grade:</strong> {studentProfile?.grade_level ?? '-'}</div>
            <div><strong>Parent Phone:</strong> {studentProfile?.parent_phone ?? '-'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Location & Time</h3>
          <div style={{ display: 'grid', gap: '0.625rem', fontSize: '0.875rem' }}>
            <div><strong>City:</strong> {profile?.city ?? '-'}</div>
            <div><strong>Province:</strong> {profile?.province ?? '-'}</div>
            <div><strong>Country:</strong> {profile?.country ?? '-'}</div>
            <div><strong>Timezone:</strong> {profile?.timezone ?? 'Asia/Karachi'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Google Calendar</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>
            {studentProfile?.google_refresh_token
              ? 'Your account is connected. Sessions can be synced to your calendar.'
              : 'Connect your Google account to sync upcoming sessions.'}
          </p>
          <a href="/api/auth/google/connect" className="btn btn-secondary btn-sm">
            {studentProfile?.google_refresh_token ? 'Reconnect Calendar' : 'Connect Calendar'}
          </a>
        </div>
      </div>
    </div>
  )
}
