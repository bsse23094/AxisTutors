import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

export default async function TutorProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, { data: tutorProfile }, { data: tutorSubjectRows }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, phone, city, province, country')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('tutor_profiles')
      .select('bio, hourly_rate, experience_years, education, rating_avg, total_sessions, is_approved, is_featured')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('tutor_subjects')
      .select('subject_id, level')
      .eq('tutor_id', user.id),
  ])

  const subjectIds = Array.from(new Set((tutorSubjectRows ?? []).map((row) => row.subject_id).filter(Boolean))) as string[]
  const { data: subjects } = subjectIds.length
    ? await supabase.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] as Array<{ id: string; name: string }> }
  const subjectMap = new Map((subjects ?? []).map((row) => [row.id, row.name]))

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Public tutor profile snapshot and teaching information.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Account</h3>
          <div style={{ display: 'grid', gap: '0.625rem', fontSize: '0.875rem' }}>
            <div><strong>Name:</strong> {profile?.full_name ?? '-'}</div>
            <div><strong>Email:</strong> {profile?.email ?? '-'}</div>
            <div><strong>Phone:</strong> {profile?.phone ?? '-'}</div>
            <div><strong>Location:</strong> {[profile?.city, profile?.province, profile?.country].filter(Boolean).join(', ') || '-'}</div>
            <div><strong>Status:</strong> {tutorProfile?.is_approved ? 'Approved' : 'Pending Review'}</div>
            <div><strong>Featured:</strong> {tutorProfile?.is_featured ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Teaching Metrics</h3>
          <div style={{ display: 'grid', gap: '0.625rem', fontSize: '0.875rem' }}>
            <div><strong>Hourly Rate:</strong> {formatCurrency(Number(tutorProfile?.hourly_rate ?? 0))}</div>
            <div><strong>Experience:</strong> {tutorProfile?.experience_years ?? 0} years</div>
            <div><strong>Rating:</strong> {Number(tutorProfile?.rating_avg ?? 0).toFixed(1)} / 5</div>
            <div><strong>Sessions Completed:</strong> {tutorProfile?.total_sessions ?? 0}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Bio & Qualifications</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.875rem' }}>
            {tutorProfile?.bio ?? 'No bio added yet.'}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <strong>Education:</strong> {tutorProfile?.education ?? '-'}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>Subjects Taught</h3>
        {!tutorSubjectRows?.length ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No subjects configured yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {tutorSubjectRows.map((row) => (
              <span key={`${row.subject_id}-${row.level ?? 'all'}`} className="badge badge-primary">
                {subjectMap.get(row.subject_id) ?? 'Subject'}{row.level ? ` · ${row.level}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
