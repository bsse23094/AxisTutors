'use client'

import { useEffect, useState } from 'react'
import StatCard from '@/components/portal/StatCard'
import { Users, Calendar, DollarSign, Star, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ConfirmedSession = {
  id: string
  studentName: string
  subjectName: string
  scheduledStart: string
}

export default function TutorDashboardClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ConfirmedSession[]>([])
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Please log in as a tutor.')
        setLoading(false)
        return
      }

      const { data: rows, error: sessionError } = await supabase
        .from('sessions')
        .select('id, student_id, subject_id, scheduled_start, status')
        .eq('tutor_id', user.id)
        .eq('status', 'confirmed')
        .order('scheduled_start', { ascending: true })
        .limit(6)

      if (sessionError) {
        setError(sessionError.message)
        setLoading(false)
        return
      }

      const studentIds = Array.from(new Set((rows ?? []).map((row) => row.student_id)))
      const subjectIds = Array.from(
        new Set((rows ?? []).map((row) => row.subject_id).filter((id): id is string => typeof id === 'string'))
      )

      const [{ data: students }, { data: subjects }] = await Promise.all([
        studentIds.length
          ? supabase.from('profiles').select('id, full_name').in('id', studentIds)
          : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
        subjectIds.length
          ? supabase.from('subjects').select('id, name').in('id', subjectIds)
          : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      ])

      const studentMap = new Map((students ?? []).map((student) => [student.id, student.full_name]))
      const subjectMap = new Map((subjects ?? []).map((subject) => [subject.id, subject.name]))

      setSessions(
        (rows ?? []).map((row) => ({
          id: row.id,
          studentName: studentMap.get(row.student_id) ?? 'Student',
          subjectName: row.subject_id ? subjectMap.get(row.subject_id) ?? 'Subject' : 'Subject',
          scheduledStart: row.scheduled_start,
        }))
      )

      setLoading(false)
    }

    void loadSessions()
  }, [])

  const markComplete = async (sessionId: string) => {
    setCompletingId(sessionId)
    setStatusMessage(null)

    try {
      const response = await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()
      if (!response.ok) {
        setStatusMessage(result.error ?? 'Unable to complete session')
        return
      }

      setSessions((prev) => prev.filter((session) => session.id !== sessionId))
      setStatusMessage('Session completed and payment capture handled.')
    } catch {
      setStatusMessage('Unexpected error while completing the session.')
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>Axis Tutors Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.25rem' }}>Manage your sessions and payments</p>
      </div>

      {statusMessage && (
        <div
          className="card"
          style={{
            padding: '0.875rem',
            marginBottom: '1rem',
            background: 'var(--primary-50)',
            borderColor: 'var(--primary-100)',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--primary-700)' }}>{statusMessage}</p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard label="Active Students" value="12" icon={<Users size={20} />} color="var(--primary)" />
        <StatCard label="Confirmed Sessions" value={sessions.length} icon={<Calendar size={20} />} color="var(--primary-dark)" />
        <StatCard label="Earnings (Month)" value="PKR 45,600" icon={<DollarSign size={20} />} color="var(--secondary-dark)" change="+15% vs last" changeType="positive" />
        <StatCard label="Average Rating" value="4.9" icon={<Star size={20} />} color="var(--accent)" />
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Confirmed Sessions</h3>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Loading sessions...</span>
          </div>
        ) : error ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--error)' }}>{error}</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No confirmed sessions waiting right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-hover)',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{session.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {session.subjectName} · {new Date(session.scheduledStart).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => void markComplete(session.id)}
                  disabled={completingId === session.id}
                >
                  {completingId === session.id ? 'Completing...' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
