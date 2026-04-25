// @ts-nocheck
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { PROVINCES } from '@/lib/utils'
import StepIndicator from '@/components/auth/StepIndicator'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

const steps = ['Account', 'Link Student']

const accountSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  street_address: z.string().optional(),
  postal_code: z.string().optional(),
})

type AccountForm = z.infer<typeof accountSchema>

export default function ParentRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [accountData, setAccountData] = useState<AccountForm | null>(null)

  const [studentEmail, setStudentEmail] = useState('')
  const [studentFound, setStudentFound] = useState<boolean | null>(null)
  const [searchingStudent, setSearchingStudent] = useState(false)

  const accountForm = useForm<AccountForm>({ resolver: zodResolver(accountSchema) })

  const checkStudentEmail = async () => {
    if (!studentEmail) return
    setSearchingStudent(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', studentEmail)
      .eq('role', 'student')
      .single()
    setStudentFound(!!data)
    setSearchingStudent(false)
  }

  const handleFinalSubmit = async () => {
    if (!accountData) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: { data: { role: 'parent', full_name: accountData.full_name } },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      const userId = authData.user.id

      // @ts-ignore - Supabase type resolves to never due to recursive generic evaluation
      await supabase.from('profiles').update({
        phone: accountData.phone,
        street_address: accountData.street_address || null,
        city: accountData.city,
        province: accountData.province,
        country: 'Pakistan',
        postal_code: accountData.postal_code || null,
      } as any).eq('id', userId)

      await supabase.from('parent_profiles').insert({
        id: userId,
      })

      // Link student if email found
      if (studentEmail && studentFound) {
        const { data: studentProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', studentEmail)
          .eq('role', 'student')
          .single()

        if (studentProfile && studentProfile.id) {
          await supabase.from('parent_student_links').insert({
            parent_id: userId,
            student_id: studentProfile.id,
            status: 'pending',
          })
        }
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div style={{
          width: '4rem', height: '4rem', borderRadius: 'var(--radius-full)',
          background: '#DCFCE7', color: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Check Your Email</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          We&apos;ve sent a verification link to <strong>{accountData?.email}</strong>.
          {studentFound && ' A link request has been sent to your child for approval.'}
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '480px' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Parent Registration</h1>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#FEE2E2', color: '#991B1B', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        {currentStep === 0 && (
          <form onSubmit={accountForm.handleSubmit((d) => { setAccountData(d); setCurrentStep(1) })} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input {...accountForm.register('full_name')} className={`input ${accountForm.formState.errors.full_name ? 'input-error' : ''}`} placeholder="Enter your full name" />
              {accountForm.formState.errors.full_name && <p className="error-text">{accountForm.formState.errors.full_name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input {...accountForm.register('email')} type="email" className={`input ${accountForm.formState.errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
              {accountForm.formState.errors.email && <p className="error-text">{accountForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...accountForm.register('password')} type="password" className={`input ${accountForm.formState.errors.password ? 'input-error' : ''}`} placeholder="Minimum 8 characters" />
              {accountForm.formState.errors.password && <p className="error-text">{accountForm.formState.errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input {...accountForm.register('phone')} type="tel" className={`input ${accountForm.formState.errors.phone ? 'input-error' : ''}`} placeholder="+92 300 1234567" />
              <p className="helper-text">This is the number your child used to reference their parent</p>
              {accountForm.formState.errors.phone && <p className="error-text">{accountForm.formState.errors.phone.message}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">City</label>
                <input {...accountForm.register('city')} className={`input ${accountForm.formState.errors.city ? 'input-error' : ''}`} placeholder="e.g. Lahore" />
              </div>
              <div>
                <label className="label">Province</label>
                <select {...accountForm.register('province')} className={`select ${accountForm.formState.errors.province ? 'input-error' : ''}`}>
                  <option value="">Select</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Continue <ArrowRight size={16} /></button>
          </form>
        )}

        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Student&apos;s Registered Email Address</label>
              <p className="helper-text" style={{ marginBottom: '0.5rem' }}>Enter the email your child used to register their student account</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  className="input"
                  placeholder="child@example.com"
                  value={studentEmail}
                  onChange={(e) => { setStudentEmail(e.target.value); setStudentFound(null) }}
                  onBlur={checkStudentEmail}
                />
              </div>
              {searchingStudent && <p className="helper-text">Searching...</p>}
              {studentFound === true && (
                <p style={{ color: 'var(--success)', fontSize: '0.8125rem', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={14} /> Student account found!
                </p>
              )}
              {studentFound === false && (
                <p className="error-text">No student account found with this email</p>
              )}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
              You can also skip this step and link your child&apos;s account later from your dashboard.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(0)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /> Back</button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
              >
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating...</> : <>Create Account <CheckCircle2 size={16} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
