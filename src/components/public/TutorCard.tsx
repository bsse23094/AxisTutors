import Link from 'next/link'

type TutorCardProps = {
  id: string
  name: string
  username?: string | null
  city?: string | null
  rating?: number
  hourlyRate?: number
}

export default function TutorCard({ id, name, username, city, rating = 0, hourlyRate = 0 }: TutorCardProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{name}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>{city ?? 'Pakistan'}</p>
      <p style={{ fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Rating: {rating.toFixed(1)}</p>
      <p style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>PKR {hourlyRate.toLocaleString()} / hour</p>
      <Link href={username ? `/tutor/${username}` : `/find-tutor`} className="btn btn-secondary btn-sm">View Profile</Link>
    </div>
  )
}
