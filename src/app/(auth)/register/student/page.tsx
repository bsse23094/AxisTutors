// @ts-nocheck
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { GRADE_LEVELS, PROVINCES, validatePakistaniPhone } from '@/lib/utils'
import StepIndicator from '@/components/auth/StepIndicator'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

const steps = ['Account', 'Personal', 'Location', 'Subjects']

const accountSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

const personalSchema = z.object({
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  grade_level: z.string().min(1, 'Please select your grade level'),
  parent_phone: z.string().min(1, 'Parent phone number is required').refine(
    val => validatePakistaniPhone(val),
    'Please enter a valid Pakistani phone number (+92XXXXXXXXXX or 03XXXXXXXXXX)'
  ),
})

const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  street_address: z.string().optional(),
  country: z.string().default('Pakistan').optional(),
  postal_code: z.string().optional(),
})

type AccountForm = z.infer<typeof accountSchema>
type PersonalForm = z.infer<typeof personalSchema>
type LocationForm = z.infer<typeof locationSchema>

// Hardcoded subjects - in production these come from DB
const availableSubjects = [
  { id: '1', name: 'Mathematics', category: 'science' },
  { id: '2', name: 'Physics', category: 'science' },
  { id: '3', name: 'Chemistry', category: 'science' },
  { id: '4', name: 'Biology', category: 'science' },
  { id: '5', name: 'English', category: 'languages' },
  { id: '6', name: 'Urdu', category: 'languages' },
  { id: '7', name: 'Computer Science', category: 'science' },
  { id: '8', name: 'Accounts', category: 'commerce' },
  { id: '9', name: 'Economics', category: 'commerce' },
  { id: '10', name: 'Pakistan Studies', category: 'arts' },
  { id: '11', name: 'Islamiat', category: 'arts' },
  { id: '12', name: 'Statistics', category: 'science' },
  { id: '13', name: 'O-Level Mathematics', category: 'science' },
  { id: '14', name: 'A-Level Physics', category: 'science' },
  { id: '15', name: 'IELTS Preparation', category: 'languages' },
  { id: '16', name: 'SAT Preparation', category: 'languages' },
]

export default function StudentRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  // Store all form data
  const [accountData, setAccountData] = useState<AccountForm | null>(null)
  const [personalData, setPersonalData] = useState<PersonalForm | null>(null)
  const [locationData, setLocationData] = useState<LocationForm | null>(null)

  const accountForm = useForm<AccountForm>({ resolver: zodResolver(accountSchema) })
  const personalForm = useForm<PersonalForm>({ resolver: zodResolver(personalSchema) })
  const locationForm = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: { country: 'Pakistan' },
  })

  const handleAccountSubmit = (data: AccountForm) => {
    setAccountData(data)
    setCurrentStep(1)
  }

  const handlePersonalSubmit = (data: PersonalForm) => {
    setPersonalData(data)
    setCurrentStep(2)
  }

  const handleLocationSubmit = (data: LocationForm) => {
    setLocationData(data)
    setCurrentStep(3)
  }

  const handleFinalSubmit = async () => {
    if (selectedSubjects.length === 0) {
      setError('Please select at least one subject')
      return
    }

    if (!accountData || !personalData || !locationData) return

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          data: {
            role: 'student',
            full_name: accountData.full_name,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      const userId = authData.user.id

      // 2. Update profiles with address
      // @ts-ignore - Supabase type resolves to never due to recursive generic evaluation
      await supabase.from('profiles').update({
        phone: personalData.parent_phone,
        street_address: locationData.street_address || null,
        city: locationData.city,
        province: locationData.province,
        country: locationData.country,
        postal_code: locationData.postal_code || null,
      } as any).eq('id', userId)

      // 3. Create student profile
      await supabase.from('student_profiles').insert({
        id: userId,
        date_of_birth: personalData.date_of_birth,
        grade_level: personalData.grade_level,
        parent_phone: personalData.parent_phone,
      })

      // 4. Insert student subjects
      for (const subjectId of selectedSubjects) {
        await supabase.from('student_subjects').insert({
          student_id: userId,
          subject_id: subjectId,
        })
      }

      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(message)
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
          Please check your inbox and click the link to activate your account.
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Student Registration
        </h1>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {error && (
        <div style={{
          padding: '0.75rem', borderRadius: 'var(--radius-sm)',
          background: '#FEE2E2', color: '#991B1B', fontSize: '0.8125rem', marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Account */}
        {currentStep === 0 && (
          <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="full_name">Full Name</label>
              <input {...accountForm.register('full_name')} id="full_name" className={`input ${accountForm.formState.errors.full_name ? 'input-error' : ''}`} placeholder="Enter your full name" />
              {accountForm.formState.errors.full_name && <p className="error-text">{accountForm.formState.errors.full_name.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <input {...accountForm.register('email')} id="email" type="email" className={`input ${accountForm.formState.errors.email ? 'input-error' : ''}`} placeholder="you@example.com" />
              {accountForm.formState.errors.email && <p className="error-text">{accountForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input {...accountForm.register('password')} id="password" type="password" className={`input ${accountForm.formState.errors.password ? 'input-error' : ''}`} placeholder="Minimum 8 characters" />
              {accountForm.formState.errors.password && <p className="error-text">{accountForm.formState.errors.password.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="confirm_password">Confirm Password</label>
              <input {...accountForm.register('confirm_password')} id="confirm_password" type="password" className={`input ${accountForm.formState.errors.confirm_password ? 'input-error' : ''}`} placeholder="Re-enter your password" />
              {accountForm.formState.errors.confirm_password && <p className="error-text">{accountForm.formState.errors.confirm_password.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Continue <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Step 2: Personal */}
        {currentStep === 1 && (
          <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="dob">Date of Birth</label>
              <input {...personalForm.register('date_of_birth')} id="dob" type="date" className={`input ${personalForm.formState.errors.date_of_birth ? 'input-error' : ''}`} />
              {personalForm.formState.errors.date_of_birth && <p className="error-text">{personalForm.formState.errors.date_of_birth.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="grade">Grade Level</label>
              <select {...personalForm.register('grade_level')} id="grade" className={`select ${personalForm.formState.errors.grade_level ? 'input-error' : ''}`}>
                <option value="">Select your grade level</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {personalForm.formState.errors.grade_level && <p className="error-text">{personalForm.formState.errors.grade_level.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="parent_phone">Parent&apos;s WhatsApp / Phone Number</label>
              <input {...personalForm.register('parent_phone')} id="parent_phone" type="tel" className={`input ${personalForm.formState.errors.parent_phone ? 'input-error' : ''}`} placeholder="+92 300 1234567 or 03001234567" />
              <p className="helper-text">This is required so we can link your parent account</p>
              {personalForm.formState.errors.parent_phone && <p className="error-text">{personalForm.formState.errors.parent_phone.message}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(0)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Location */}
        {currentStep === 2 && (
          <form onSubmit={locationForm.handleSubmit(handleLocationSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="street">Street Address (Optional)</label>
              <input {...locationForm.register('street_address')} id="street" className="input" placeholder="House #, Street, Area" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="city">City</label>
                <input {...locationForm.register('city')} id="city" className={`input ${locationForm.formState.errors.city ? 'input-error' : ''}`} placeholder="e.g. Lahore" />
                {locationForm.formState.errors.city && <p className="error-text">{locationForm.formState.errors.city.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="province">Province</label>
                <select {...locationForm.register('province')} id="province" className={`select ${locationForm.formState.errors.province ? 'input-error' : ''}`}>
                  <option value="">Select</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {locationForm.formState.errors.province && <p className="error-text">{locationForm.formState.errors.province.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Country</label>
                <input {...locationForm.register('country')} className="input" disabled value="Pakistan" />
              </div>
              <div>
                <label className="label" htmlFor="postal">Postal Code (Optional)</label>
                <input {...locationForm.register('postal_code')} id="postal" className="input" placeholder="e.g. 54000" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Subjects */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Select Subjects of Interest (minimum 1)</label>
              <p className="helper-text" style={{ marginBottom: '0.75rem' }}>Choose the subjects you&apos;d like to find tutors for</p>
            </div>

            {['science', 'languages', 'commerce', 'arts'].map(category => {
              const subjects = availableSubjects.filter(s => s.category === category)
              if (subjects.length === 0) return null
              return (
                <div key={category}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem',
                  }}>
                    {category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {subjects.map(sub => {
                      const selected = selectedSubjects.includes(sub.id)
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubjects(prev =>
                              selected ? prev.filter(s => s !== sub.id) : [...prev, sub.id]
                            )
                          }}
                          style={{
                            padding: '0.375rem 0.875rem',
                            borderRadius: 'var(--radius-full)',
                            border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                            background: selected ? 'var(--primary-50)' : 'transparent',
                            color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            fontFamily: 'inherit',
                          }}
                        >
                          {sub.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading || selectedSubjects.length === 0}
                className="btn btn-primary"
                style={{ flex: 1, opacity: (loading || selectedSubjects.length === 0) ? 0.6 : 1 }}
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
