'use client'

import { useState } from 'react'

export default function GoogleCalendarSync() {
  const [loading, setLoading] = useState(false)

  const syncNow = async () => {
    setLoading(true)
    try {
      await fetch('/api/calendar/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <a href="/api/auth/google/connect" className="btn btn-secondary btn-sm">Connect Google Calendar</a>
      <button onClick={syncNow} className="btn btn-primary btn-sm" disabled={loading}>{loading ? 'Syncing...' : 'Sync Now'}</button>
    </div>
  )
}
