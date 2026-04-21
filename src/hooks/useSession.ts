'use client'

import { useState } from 'react'

type SessionPayload = {
  tutorId: string
  subjectId: string
  scheduledStart: string
  scheduledEnd: string
  sessionLink?: string
}

export function useSession() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const bookSession = async (payload: SessionPayload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result.error ?? 'Failed to book session')
        setStatus(null)
      } else {
        setStatus(result.status ?? 'pending_payment')
      }
    } catch {
      setError('Unexpected error during booking')
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, status, bookSession }
}
