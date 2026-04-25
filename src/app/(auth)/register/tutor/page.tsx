// @ts-nocheck
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { PROVINCES, TEACHING_LEVELS } from '@/lib/utils'
import StepIndicator from '@/components/auth/StepIndicator'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Upload } from 'lucide-react'

const steps = ['Account', 'Personal', 'Location', 'Teaching', 'Documents']

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
  phone: z.string().min(1, 'Phone number is required'),
  bio: z.string().min(100, 'Bio must be at least 100 characters').max(1000, 'Bio must be under 1000 characters'),
  experience_years: z.coerce.number().min(0, 'Must be 0 or more'),
  education: z.string().min(1, 'Please describe your qualifications'),
  hourly_rate: z.coerce.number().min(500, 'Minimum rate is PKR 500'),
})

const locationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  street_address: z.string().optional(),
  country: z.string().default('Pakistan').optional(),
  postal_code: z.string().optional(),
})

type AccountForm = z.infer<typeof accountSchema>
type PersonalFormInput = z.input<typeof personalSchema>
type PersonalForm = z.output<typeof personalSchema>
type LocationForm = z.infer<typeof locationSchema>

const availableSubjects = [
  { id: '1', name: 'Mathematics' }, { id: '2', name: 'Physics' },
  { id: '3', name: 'Chemistry' }, { id: '4', name: 'Biology' },
  { id: '5', name: 'English' }, { id: '6', name: 'Urdu' },
  { id: '7', name: 'Computer Science' }, { id: '8', name: 'Accounts' },
  { id: '9', name: 'Economics' }, { id: '10', name: 'Pakistan Studies' },
  { id: '11', name: 'Islamiat' }, { id: '12', name: 'Statistics' },
  { id: '13', name: 'O-Level Mathematics' }, { id: '14', name: 'A-Level Physics' },
  { id: '15', name: 'IELTS Preparation' }, { id: '16', name: 'SAT Preparation' },
]

export default function TutorRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [accountData, setAccountData] = useState<AccountForm | null>(null)
  const [personalData, setPersonalData] = useState<PersonalForm | null>(null)
  const [locationData, setLocationData] = useState<LocationForm | null>(null)
  const [teachingSubjects, setTeachingSubjects] = useState<{ subjectId: string; level: string }[]>([])
  const [documents, setDocuments] = useState<File[]>([])

  const accountForm = useForm<AccountForm>({ resolver: zodResolver(accountSchema) })
  const personalForm = useForm<PersonalFormInput, unknown, PersonalForm>({ resolver: zodResolver(personalSchema) })
  const locationForm = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: { country: 'Pakistan' },
  })

  const handleFinalSubmit = async () => {
    if (teachingSubjects.length === 0) {
      setError('Please select at least one subject to teach')
      return
    }
    if (!accountData || !personalData || !locationData) return

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: { data: { role: 'tutor', full_name: accountData.full_name } },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      const userId = authData.user.id

      // @ts-ignore - Supabase type resolves to never due to recursive generic evaluation
      await supabase.from('profiles').update({
        phone: personalData.phone,
        street_address: locationData.street_address || null,
        city: locationData.city,
        province: locationData.province,
        country: locationData.country,
        postal_code: locationData.postal_code || null,
      } as any).eq('id', userId)

      await supabase.from('tutor_profiles').insert({
        id: userId,
        bio: personalData.bio,
        hourly_rate: personalData.hourly_rate,
        experience_years: personalData.experience_years,
        education: personalData.education,
        is_approved: false,
        username: accountData.full_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
      })

      for (const ts of teachingSubjects) {
        await supabase.from('tutor_subjects').insert({
          tutor_id: userId,
          subject_id: ts.subjectId,
          level: ts.level,
        })
      }

      // Upload documents
      for (const file of documents) {
        const filePath = `${userId}/${Date.now()}_${file.name}`
        await supabase.storage.from('tutor-documents').upload(filePath, file)
        const { data: urlData } = supabase.storage.from('tutor-documents').getPublicUrl(filePath)

        await supabase.from('tutor_documents').insert({
          tutor_id: userId,
          document_type: 'degree',
          file_url: urlData.publicUrl,
          file_name: file.name,
        })
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Application Submitted!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          We&apos;ll review your documents and activate your account within 24–48 hours. 
          You&apos;ll receive an email once your application is approved.
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tutor Application</h1>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {error && (
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#FEE2E2', color: '#991B1B', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Account */}
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
              <label className="label">Confirm Password</label>
              <input {...accountForm.register('confirm_password')} type="password" className={`input ${accountForm.formState.errors.confirm_password ? 'input-error' : ''}`} placeholder="Re-enter password" />
              {accountForm.formState.errors.confirm_password && <p className="error-text">{accountForm.formState.errors.confirm_password.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Continue <ArrowRight size={16} /></button>
          </form>
        )}

        {/* Step 2: Personal */}
        {currentStep === 1 && (
          <form onSubmit={personalForm.handleSubmit((d) => { setPersonalData(d); setCurrentStep(2) })} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Phone Number</label>
              <input {...personalForm.register('phone')} type="tel" className={`input ${personalForm.formState.errors.phone ? 'input-error' : ''}`} placeholder="+92 300 1234567" />
              {personalForm.formState.errors.phone && <p className="error-text">{personalForm.formState.errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea {...personalForm.register('bio')} className={`input ${personalForm.formState.errors.bio ? 'input-error' : ''}`} rows={4} placeholder="Tell students about yourself (min 100 characters)" style={{ resize: 'vertical' }} />
              {personalForm.formState.errors.bio && <p className="error-text">{personalForm.formState.errors.bio.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Experience (Years)</label>
                <input {...personalForm.register('experience_years')} type="number" min="0" className={`input ${personalForm.formState.errors.experience_years ? 'input-error' : ''}`} />
                {personalForm.formState.errors.experience_years && <p className="error-text">{personalForm.formState.errors.experience_years.message}</p>}
              </div>
              <div>
                <label className="label">Hourly Rate (PKR)</label>
                <input {...personalForm.register('hourly_rate')} type="number" min="500" className={`input ${personalForm.formState.errors.hourly_rate ? 'input-error' : ''}`} placeholder="Min 500" />
                {personalForm.formState.errors.hourly_rate && <p className="error-text">{personalForm.formState.errors.hourly_rate.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Education & Qualifications</label>
              <textarea {...personalForm.register('education')} className={`input ${personalForm.formState.errors.education ? 'input-error' : ''}`} rows={3} placeholder="Degrees, certifications, etc." style={{ resize: 'vertical' }} />
              {personalForm.formState.errors.education && <p className="error-text">{personalForm.formState.errors.education.message}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setCurrentStep(0)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /> Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Continue <ArrowRight size={16} /></button>
            </div>
          </form>
        )}

        {/* Step 3: Location */}
        {currentStep === 2 && (
          <form onSubmit={locationForm.handleSubmit((d) => { setLocationData(d); setCurrentStep(3) })} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Street Address (Optional)</label>
              <input {...locationForm.register('street_address')} className="input" placeholder="House #, Street, Area" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input {...locationForm.register('city')} className={`input ${locationForm.formState.errors.city ? 'input-error' : ''}`} placeholder="e.g. Lahore" />
                {locationForm.formState.errors.city && <p className="error-text">{locationForm.formState.errors.city.message}</p>}
              </div>
              <div>
                <label className="label">Province</label>
                <select {...locationForm.register('province')} className={`select ${locationForm.formState.errors.province ? 'input-error' : ''}`}>
                  <option value="">Select</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /> Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Continue <ArrowRight size={16} /></button>
            </div>
          </form>
        )}

        {/* Step 4: Teaching */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label className="label">Select Subjects You Teach</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
              {availableSubjects.map(sub => {
                const existing = teachingSubjects.find(ts => ts.subjectId === sub.id)
                return (
                  <div key={sub.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${existing ? 'var(--primary)' : 'var(--border)'}`,
                    background: existing ? 'var(--primary-50)' : 'transparent',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="checkbox"
                      checked={!!existing}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTeachingSubjects(prev => [...prev, { subjectId: sub.id, level: 'All Levels' }])
                        } else {
                          setTeachingSubjects(prev => prev.filter(ts => ts.subjectId !== sub.id))
                        }
                      }}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{sub.name}</span>
                    {existing && (
                      <select
                        value={existing.level}
                        onChange={(e) => {
                          setTeachingSubjects(prev => prev.map(ts =>
                            ts.subjectId === sub.id ? { ...ts, level: e.target.value } : ts
                          ))
                        }}
                        className="select"
                        style={{ width: 'auto', padding: '0.25rem 1.75rem 0.25rem 0.5rem', fontSize: '0.8125rem' }}
                      >
                        {TEACHING_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /> Back</button>
              <button type="button" onClick={() => teachingSubjects.length > 0 ? setCurrentStep(4) : setError('Select at least one subject')} className="btn btn-primary" style={{ flex: 1 }}>Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 5: Documents */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label className="label">Upload Verification Documents</label>
            <p className="helper-text">At least one document required (degree, CNIC, or certificate). PDF or image format.</p>
            
            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onClick={() => document.getElementById('doc-upload')?.click()}
            >
              <Upload size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click to upload or drag and drop</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG (max 10MB)</p>
              <input
                id="doc-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) {
                    setDocuments(prev => [...prev, ...Array.from(e.target.files!)])
                  }
                }}
              />
            </div>

            {documents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {documents.map((doc, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-hover)', fontSize: '0.8125rem',
                  }}>
                    <span>{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => setDocuments(prev => prev.filter((_, idx) => idx !== i))}
                      style={{
                        background: 'none', border: 'none', color: 'var(--error)',
                        cursor: 'pointer', fontSize: '0.8125rem', fontFamily: 'inherit',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary" style={{ flex: 1 }}><ArrowLeft size={16} /> Back</button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading || documents.length === 0}
                className="btn btn-primary"
                style={{ flex: 1, opacity: (loading || documents.length === 0) ? 0.6 : 1 }}
              >
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <>Submit Application <CheckCircle2 size={16} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
