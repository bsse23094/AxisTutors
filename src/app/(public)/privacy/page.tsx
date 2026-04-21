import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="container section" style={{ maxWidth: '860px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        We collect only data required to deliver tutoring services, secure accounts, and process transactions.
        Personal information is protected with industry-standard safeguards and is never sold to third parties.
      </p>
    </div>
  )
}
