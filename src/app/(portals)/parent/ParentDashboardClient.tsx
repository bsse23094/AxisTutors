'use client'

import { useEffect, useMemo, useState } from 'react'
import StatCard from '@/components/portal/StatCard'
import { Calendar, DollarSign, MessageSquare, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type PendingSession = {
  id: string
  tutorId: string
  studentId: string
  subjectId: string | null
  scheduledStart: string
  totalAmount: number
}

type SessionView = PendingSession & {
  tutorName: string
  studentName: string
  subjectName: string
}

export default function ParentDashboardClient() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<SessionView[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const pendingCount = pending.length
  const monthlyPending = useMemo(
    () => pending.reduce((sum, session) => sum + Number(session.totalAmount), 0),
    [pending]
  )

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Please log in as a parent to view dashboard data.')
        setLoading(false)
        return
      }

      const { data: links, error: linkError } = await supabase
        .from('parent_student_links')
        .select('student_id')
        .eq('parent_id', user.id)
        .eq('status', 'approved')

      if (linkError) {
        setError(linkError.message)
        setLoading(false)
        return
      }

      const childIds = (links ?? []).map((link) => link.student_id)
      if (!childIds.length) {
        setPending([])
        setLoading(false)
        return
      }

      const { data: sessions, error: sessionError } = await supabase
        .from('sessions')
        .select('id, tutor_id, student_id, subject_id, scheduled_start, total_amount')
        .eq('status', 'pending_payment')
        .in('student_id', childIds)
        .order('scheduled_start', { ascending: true })
        .limit(5)

      if (sessionError) {
        setError(sessionError.message)
        setLoading(false)
        return
      }

      const normalized: PendingSession[] = (sessions ?? []).map((session) => ({
        id: session.id,
        tutorId: session.tutor_id,
        studentId: session.student_id,
        subjectId: session.subject_id,
        scheduledStart: session.scheduled_start,
        totalAmount: Number(session.total_amount),
      }))

      const profileIds = Array.from(
        new Set(normalized.flatMap((session) => [session.tutorId, session.studentId]))
      )
      const subjectIds = Array.from(
        new Set(
          normalized
            .map((session) => session.subjectId)
            .filter((id): id is string => typeof id === 'string')
        )
      )

      const [{ data: profiles }, { data: subjects }] = await Promise.all([
        profileIds.length
          ? supabase.from('profiles').select('id, full_name').in('id', profileIds)
          : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
        subjectIds.length
          ? supabase.from('subjects').select('id, name').in('id', subjectIds)
          : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      ])

      const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]))
      const subjectMap = new Map((subjects ?? []).map((subject) => [subject.id, subject.name]))

      setPending(
        normalized.map((session) => ({
          ...session,
          tutorName: profileMap.get(session.tutorId) ?? 'Tutor',
          studentName: profileMap.get(session.studentId) ?? 'Student',
          subjectName: session.subjectId ? subjectMap.get(session.subjectId) ?? 'Subject' : 'Subject',
        }))
      )

      setLoading(false)
    }

    void loadDashboard()
  }, [])

  const approvePayment = async (sessionId: string) => {
    setApprovingId(sessionId)
    setStatusMessage(null)

    try {
      const response = await fetch('/api/payments/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()
      if (!response.ok) {
        setStatusMessage(result.error ?? 'Unable to authorize payment')
        return
      }

      setPending((prev) => prev.filter((session) => session.id !== sessionId))
      setStatusMessage(
        result.calendarSyncWarning
          ? `Payment approved. Calendar note: ${result.calendarSyncWarning}`
          : 'Payment approved and session confirmed.'
      )
    } catch {
      setStatusMessage('Something went wrong while approving payment.')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Parent Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor your child&apos;s learning progress</p>
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

      {loading ? (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Loading pending approvals...</span>
        </div>
      ) : pendingCount > 0 ? (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius)',
            background: '#FEF3C7',
            border: '1px solid #FBBF24',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={20} color="#92400E" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>Payment Approval Required</div>
            <div style={{ fontSize: '0.8125rem', color: '#A16207' }}>
              {pendingCount} booking{pendingCount === 1 ? '' : 's'} waiting for your approval.
            </div>
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard label="Pending Approvals" value={pendingCount} icon={<AlertCircle size={20} />} color="#F59E0B" />
        <StatCard label="Pending Amount" value={`PKR ${monthlyPending.toLocaleString()}`} icon={<DollarSign size={20} />} color="#F59E0B" />
        <StatCard label="Unread Messages" value="5" icon={<MessageSquare size={20} />} color="#1F8F62" />
        <StatCard label="Total Hours" value="48" icon={<Clock size={20} />} color="#22C55E" />
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Pending Payment Approvals</h3>
        {pendingCount === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No pending payments right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map((session) => (
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
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {session.studentName} with {session.tutorName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {session.subjectName} · {new Date(session.scheduledStart).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    PKR {session.totalAmount.toLocaleString()}
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => void approvePayment(session.id)}
                    disabled={approvingId === session.id}
                  >
                    {approvingId === session.id ? 'Approving...' : 'Approve & Pay'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Upcoming Sessions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { tutor: 'Ahmed Khan', subject: 'Physics', time: 'Today 4:00 PM', paid: true },
            { tutor: 'Fatima Noor', subject: 'Chemistry', time: 'Tomorrow 3:00 PM', paid: true },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-hover)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar avatar-md" style={{ background: 'var(--accent)', color: 'white' }}>
                  {s.tutor
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.tutor}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.subject} · {s.time}
                  </div>
                </div>
              </div>
              {s.paid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
