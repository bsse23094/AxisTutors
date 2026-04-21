import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import RatingStars from '@/components/shared/RatingStars'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `Tutor ${username}` }
}

export default async function PublicTutorProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: tutor } = await supabase
    .from('tutor_profiles')
    .select('id, bio, hourly_rate, experience_years, education, rating_avg, total_sessions, is_approved, username')
    .eq('username', username)
    .eq('is_approved', true)
    .maybeSingle()

  if (!tutor) {
    notFound()
  }

  const [{ data: profile }, { data: tutorSubjects }] = await Promise.all([
    supabase.from('profiles').select('full_name, city, province').eq('id', tutor.id).maybeSingle(),
    supabase.from('tutor_subjects').select('subject_id, level').eq('tutor_id', tutor.id),
  ])

  const subjectIds = Array.from(new Set((tutorSubjects ?? []).map((row) => row.subject_id)))
  const { data: subjects } = subjectIds.length
    ? await supabase.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] as Array<{ id: string; name: string }> }
  const subjectMap = new Map((subjects ?? []).map((row) => [row.id, row.name]))

  return (
    <div className="container section" style={{ maxWidth: '920px' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {profile?.full_name ?? 'Tutor'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {[profile?.city, profile?.province].filter(Boolean).join(', ') || 'Pakistan'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge badge-info">{formatCurrency(Number(tutor.hourly_rate))} / hour</span>
          <span className="badge badge-primary">{tutor.experience_years} years exp</span>
          <span className="badge badge-success">{tutor.total_sessions} sessions</span>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <RatingStars rating={Number(tutor.rating_avg ?? 0)} />
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          {tutor.bio ?? 'No bio provided yet.'}
        </p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.625rem' }}>Subjects</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(tutorSubjects ?? []).map((row) => (
            <span key={`${row.subject_id}-${row.level ?? 'all'}`} className="badge badge-primary">
              {subjectMap.get(row.subject_id) ?? 'Subject'}{row.level ? ` · ${row.level}` : ''}
            </span>
          ))}
          {!(tutorSubjects ?? []).length && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No subjects listed.</span>
          )}
        </div>
      </div>
    </div>
  )
}
