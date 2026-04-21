import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Subject ${slug}` }
}

export default async function SubjectDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: subject } = await supabase
    .from('subjects')
    .select('id, name, description')
    .eq('slug', slug)
    .maybeSingle()

  if (!subject) {
    notFound()
  }

  const { data: tutorSubjects } = await supabase
    .from('tutor_subjects')
    .select('tutor_id, level')
    .eq('subject_id', subject.id)

  const tutorIds = Array.from(new Set((tutorSubjects ?? []).map((row) => row.tutor_id)))
  const [{ data: tutorProfiles }, { data: profiles }] = await Promise.all([
    tutorIds.length
      ? supabase.from('tutor_profiles').select('id, username, hourly_rate, rating_avg, is_approved').in('id', tutorIds).eq('is_approved', true)
      : Promise.resolve({ data: [] as Array<{ id: string; username: string | null; hourly_rate: number; rating_avg: number }> }),
    tutorIds.length
      ? supabase.from('profiles').select('id, full_name, city').in('id', tutorIds)
      : Promise.resolve({ data: [] as Array<{ id: string; full_name: string; city: string | null }> }),
  ])

  const profileMap = new Map((profiles ?? []).map((row) => [row.id, row]))

  return (
    <div className="container section">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{subject.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{subject.description ?? 'Explore tutors for this subject.'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {(tutorProfiles ?? []).map((tutor) => {
          const profile = profileMap.get(tutor.id)
          return (
            <div key={tutor.id} className="card" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{profile?.full_name ?? 'Tutor'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>{profile?.city ?? 'Pakistan'}</p>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Rating: {Number(tutor.rating_avg ?? 0).toFixed(1)}
              </p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                {formatCurrency(Number(tutor.hourly_rate ?? 0))} / hour
              </p>
              <Link href={tutor.username ? `/tutor/${tutor.username}` : '/find-tutor'} className="btn btn-secondary btn-sm">
                View Tutor
              </Link>
            </div>
          )
        })}

        {!(tutorProfiles ?? []).length && (
          <div className="card" style={{ padding: '1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No approved tutors found for this subject yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
