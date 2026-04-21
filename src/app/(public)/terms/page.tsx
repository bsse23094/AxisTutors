import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="container section" style={{ maxWidth: '860px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        By using Axis Tutors, you agree to our platform terms regarding account usage, session booking,
        conduct, and payment policies. Misuse of the platform may result in account suspension.
      </p>
    </div>
  )
}
