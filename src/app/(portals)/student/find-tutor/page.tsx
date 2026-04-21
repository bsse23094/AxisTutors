'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type TutorItem = {
  id: string
  name: string
  city: string | null
  hourlyRate: number
  subjectId: string | null
  subjectName: string | null
}

type TutorRow = {
  id: string
  hourly_rate?: number | null
  profiles?: { full_name?: string | null; city?: string | null } | null
  tutor_subjects?: Array<{ subject_id?: string | null; subjects?: { name?: string | null } | null }> | null
}

export default function StudentFindTutorPage() {
  const [tutors, setTutors] = useState<TutorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingTutorId, setBookingTutorId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadTutors = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error: loadError } = await supabase
        .from('tutor_profiles')
        .select(
          `
          id,
          hourly_rate,
          profiles:profiles!inner(full_name, city),
          tutor_subjects(subject_id, subjects(name))
        `
        )
        .eq('is_approved', true)
        .limit(12)

      if (loadError) {
        setError(loadError.message)
        setLoading(false)
        return
      }

      const normalized: TutorItem[] = ((data ?? []) as TutorRow[]).map((row) => {
        const firstSubject = row.tutor_subjects?.[0]
        const firstSubjectName = firstSubject?.subjects?.name ?? null

        return {
          id: row.id,
          name: row.profiles?.full_name ?? 'Tutor',
          city: row.profiles?.city ?? null,
          hourlyRate: Number(row.hourly_rate ?? 0),
          subjectId: firstSubject?.subject_id ?? null,
          subjectName: firstSubjectName,
        }
      })

      setTutors(normalized)
      setLoading(false)
    }

    loadTutors()
  }, [])

  const bookTrialSession = async (tutor: TutorItem) => {
    if (!tutor.subjectId) {
      setMessage('This tutor has no configured subjects yet.')
      return
    }

    setBookingTutorId(tutor.id)
    setMessage(null)

    const start = new Date()
    start.setDate(start.getDate() + 1)
    start.setHours(16, 0, 0, 0)

    const end = new Date(start)
    end.setHours(end.getHours() + 1)

    try {
      const response = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId: tutor.id,
          subjectId: tutor.subjectId,
          scheduledStart: start.toISOString(),
          scheduledEnd: end.toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.error ?? 'Booking failed')
        return
      }

      setMessage('Booking created. Waiting for parent payment approval.')
    } catch {
      setMessage('Something went wrong while booking the session.')
    } finally {
      setBookingTutorId(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Find a Tutor</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Book directly from your portal. New sessions go to your parent for payment approval.
        </p>
      </div>

      {message && (
        <div
          className="card"
          style={{
            marginBottom: '1rem',
            padding: '0.875rem',
            background: 'var(--primary-50)',
            borderColor: 'var(--primary-100)',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--primary-700)' }}>{message}</p>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading tutors...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {tutors.map((tutor) => (
            <div key={tutor.id} className="card" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{tutor.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {tutor.city ?? 'Pakistan'}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Subject: {tutor.subjectName ?? 'Not set'}
              </p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                {formatCurrency(tutor.hourlyRate)} / hour
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={bookingTutorId === tutor.id || !tutor.subjectId}
                onClick={() => void bookTrialSession(tutor)}
              >
                {bookingTutorId === tutor.id ? 'Booking...' : 'Book 1-Hour Session'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
