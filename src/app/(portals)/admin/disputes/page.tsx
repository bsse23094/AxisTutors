import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDisputesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: actor } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const actorRole = (actor as { role?: string } | null)?.role
  if (actorRole !== 'admin') {
    redirect('/login')
  }

  const [{ data: disputedSessions }, { data: flaggedMessages }] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, tutor_id, student_id, status, cancellation_reason, scheduled_start')
      .eq('status', 'disputed')
      .order('scheduled_start', { ascending: false })
      .limit(50),
    supabase
      .from('messages')
      .select('id, room_id, sender_id, content, created_at, is_flagged')
      .eq('is_flagged', true)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const safeDisputedSessions = (disputedSessions ?? []) as Array<{
    id: string
    cancellation_reason?: string | null
  }>
  const safeFlaggedMessages = (flaggedMessages ?? []) as Array<{
    id: string
    content?: string | null
    created_at?: string | null
  }>

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Disputes</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Track disputed sessions and flagged chat events.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '1rem' }}><strong>Disputed Sessions:</strong> {safeDisputedSessions.length}</div>
        <div className="card" style={{ padding: '1rem' }}><strong>Flagged Messages:</strong> {safeFlaggedMessages.length}</div>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Session Disputes</h2>
        {!safeDisputedSessions.length ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No disputed sessions.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {safeDisputedSessions.map((session) => (
              <div key={session.id} style={{ background: 'var(--surface-hover)', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Session {session.id.slice(0, 8)}...</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {session.cancellation_reason ?? 'No reason attached'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Flagged Messages</h2>
        {!safeFlaggedMessages.length ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No flagged messages.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {safeFlaggedMessages.map((message) => (
              <div key={message.id} style={{ background: 'var(--surface-hover)', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.8125rem' }}>{message.content ?? '(attachment)'}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {message.created_at
                    ? new Date(message.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
                    : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
