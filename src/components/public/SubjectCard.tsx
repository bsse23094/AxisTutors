import Link from 'next/link'

type SubjectCardProps = {
  name: string
  slug: string
  tutorsCount?: number
}

export default function SubjectCard({ name, slug, tutorsCount = 0 }: SubjectCardProps) {
  return (
    <Link href={`/subjects/${slug}`} className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', padding: '1rem', display: 'block' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tutorsCount} tutors</p>
    </Link>
  )
}
