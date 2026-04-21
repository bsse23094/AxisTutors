'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type CalendarSession = {
  id: string
  status: string
  scheduled_start: string
  scheduled_end: string
  subject_id: string | null
}

export function useCalendar(role: 'student' | 'tutor', userId: string | null) {
  const [sessions, setSessions] = useState<CalendarSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const load = async () => {
      setLoading(true)
      const column = role === 'student' ? 'student_id' : 'tutor_id'
      const { data } = await supabase
        .from('sessions')
        .select('id, status, scheduled_start, scheduled_end, subject_id')
        .eq(column, userId)
        .order('scheduled_start', { ascending: true })
      setSessions((data ?? []) as CalendarSession[])
      setLoading(false)
    }

    load()
  }, [role, userId])

  return { sessions, loading }
}
