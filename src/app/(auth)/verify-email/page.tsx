import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Verify Email' }

export default function VerifyEmailPage() {
  return (
    <div style={{ maxWidth: '440px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Check Your Email</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        We&apos;ve sent you a verification link. Click it to activate your Axis Tutors account.
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Didn&apos;t receive the email? Check your spam folder or try again.
      </p>
      <Link href="/login" className="btn btn-primary">Back to Login</Link>
    </div>
  )
}
