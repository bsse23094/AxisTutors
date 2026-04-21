'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div style={{ maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Check Your Email</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          If an account exists for <strong>{email}</strong>, a password reset link has been sent.
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Reset Password</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#FEE2E2', color: '#991B1B', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  )
}
