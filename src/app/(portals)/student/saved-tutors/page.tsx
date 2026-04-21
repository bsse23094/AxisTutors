import Link from 'next/link'
import { redirect } from 'next/navigation'
import RatingStars from '@/components/shared/RatingStars'
import SubjectBadge from '@/components/shared/SubjectBadge'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

export default async function StudentSavedTutorsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: savedRows, error } = await supabase
    .from('saved_tutors')
    .select('tutor_id, created_at')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Saved Tutors</h1>
        <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error.message}</p>
      </div>
    )
  }

  const tutorIds = (savedRows ?? []).map((row) => row.tutor_id)
  const [{ data: tutorProfiles }, { data: profileRows }, { data: tutorSubjectRows }] = await Promise.all([
    tutorIds.length
      ? supabase
          .from('tutor_profiles')
          .select('id, hourly_rate, rating_avg')
          .in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name, city').in('id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
    tutorIds.length
      ? supabase
          .from('tutor_subjects')
          .select('tutor_id, level, subject_id')
          .in('tutor_id', tutorIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const subjectIds = Array.from(
    new Set((tutorSubjectRows ?? []).map((row) => row.subject_id).filter(Boolean))
  ) as string[]

  const { data: subjectRows } = subjectIds.length
    ? await supabase.from('subjects').select('id, name').in('id', subjectIds)
    : { data: [] as Array<{ id: string; name: string }> }

  const tutorProfileMap = new Map((tutorProfiles ?? []).map((row) => [row.id, row]))
  const profileMap = new Map((profileRows ?? []).map((row) => [row.id, row]))
  const subjectMap = new Map((subjectRows ?? []).map((row) => [row.id, row.name]))
  const subjectsByTutor = new Map<string, Array<{ name: string; level: string | null }>>()

  for (const row of tutorSubjectRows ?? []) {
    const list = subjectsByTutor.get(row.tutor_id) ?? []
    list.push({
      name: subjectMap.get(row.subject_id) ?? 'Subject',
      level: row.level,
    })
    subjectsByTutor.set(row.tutor_id, list)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Saved Tutors</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Tutors you shortlisted for future sessions.
          </p>
        </div>
        <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
          Explore Tutors
        </Link>
      </div>

      {!savedRows?.length ? (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            You have not saved any tutors yet.
          </p>
          <Link href="/student/find-tutor" className="btn btn-primary btn-sm">
            Find Tutors
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {savedRows.map((saved) => {
            const profile = profileMap.get(saved.tutor_id)
            const tutor = tutorProfileMap.get(saved.tutor_id)
            const tutorSubjects = subjectsByTutor.get(saved.tutor_id) ?? []

            return (
              <div key={saved.tutor_id} className="card" style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{profile?.full_name ?? 'Tutor'}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {profile?.city ?? 'Pakistan'}
                </p>

                <div style={{ marginBottom: '0.75rem' }}>
                  <RatingStars rating={Number(tutor?.rating_avg ?? 0)} />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                  {tutorSubjects.slice(0, 3).map((subject) => (
                    <SubjectBadge key={`${saved.tutor_id}-${subject.name}-${subject.level ?? 'all'}`} name={subject.name} level={subject.level ?? undefined} size="sm" />
                  ))}
                </div>

                <p style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                  {formatCurrency(Number(tutor?.hourly_rate ?? 0))} / hour
                </p>

                <Link href="/student/find-tutor" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Book Session
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
