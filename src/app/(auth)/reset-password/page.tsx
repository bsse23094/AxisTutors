'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Password reset successful. You can now log in.')
    }

    setLoading(false)
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Reset Password</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Enter your new password below.
      </p>

      {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>{error}</div>}
      {message && <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>{message}</div>}

      <form onSubmit={onSubmit} className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        <div>
          <label className="label">New Password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
