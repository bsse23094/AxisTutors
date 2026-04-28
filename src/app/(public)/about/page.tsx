import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="container section" style={{ maxWidth: '860px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>About Axis Tutors</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        Axis Tutors is an online tutoring marketplace focused on student outcomes, parent transparency,
        and tutor quality across the globe. Our platform connects students with vetted tutors and provides
        role-specific portals for learning, monitoring, and payments.
      </p>
    </div>
  )
}
