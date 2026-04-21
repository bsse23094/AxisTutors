'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/portal')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  return (
    <div style={{ width: '100%', maxWidth: '440px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
          Log in to your Axis Tutors portal
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="btn btn-secondary"
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            fontSize: '0.9375rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          or
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: '#FEE2E2',
            color: '#991B1B',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label" htmlFor="password">Password</label>
              <Link href="/forgot-password" style={{
                fontSize: '0.8125rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500,
              }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9375rem',
            marginTop: '0.5rem',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Logging in...' : <>Log In <LogIn size={16} /></>}
          </button>
        </form>
      </div>

      <p style={{
        textAlign: 'center',
        marginTop: '1.25rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Get Started
        </Link>
      </p>
    </div>
  )
}
