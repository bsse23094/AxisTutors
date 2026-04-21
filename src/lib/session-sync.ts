import { createCalendarEvent } from '@/lib/google-calendar'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

type ServiceClient = SupabaseClient<Database>

export async function syncSessionToCalendar(
  service: ServiceClient,
  sessionId: string
): Promise<{ synced: boolean; reason?: string }> {
  const { data: session, error: sessionError } = await service
    .from('sessions')
    .select(
      'id, tutor_id, student_id, subject_id, scheduled_start, scheduled_end, session_link, google_event_id_tutor, google_event_id_student'
    )
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) {
    return { synced: false, reason: 'Session not found for calendar sync' }
  }

  const safeSession = session as {
    tutor_id: string
    student_id: string
    subject_id?: string | null
    session_link?: string | null
    scheduled_start: string
    scheduled_end: string
    google_event_id_tutor?: string | null
    google_event_id_student?: string | null
  }

  const [{ data: tutorProfile }, { data: studentProfile }, { data: tutor }, { data: student }, { data: subject }] =
    await Promise.all([
      service
        .from('tutor_profiles')
        .select('google_refresh_token')
        .eq('id', safeSession.tutor_id)
        .maybeSingle(),
      service
        .from('student_profiles')
        .select('google_refresh_token')
        .eq('id', safeSession.student_id)
        .maybeSingle(),
      service
        .from('profiles')
        .select('full_name, email')
        .eq('id', safeSession.tutor_id)
        .single(),
      service
        .from('profiles')
        .select('full_name, email')
        .eq('id', safeSession.student_id)
        .single(),
      service
        .from('subjects')
        .select('name')
        .eq('id', safeSession.subject_id as string)
        .maybeSingle(),
    ])

  const subjectName = subject?.name ?? 'Tutoring Session'

  const eventDetails = {
    summary: `Tutoring: ${subjectName}`,
    description: `Session between ${tutor?.full_name ?? 'Tutor'} and ${student?.full_name ?? 'Student'}\n\nJoin link: ${safeSession.session_link ?? 'TBD'}`,
    startDateTime: safeSession.scheduled_start,
    endDateTime: safeSession.scheduled_end,
  }

  const updates: Partial<Database['public']['Tables']['sessions']['Update']> = {}

  if (!safeSession.google_event_id_tutor && tutorProfile?.google_refresh_token) {
    const tutorEventId = await createCalendarEvent(tutorProfile.google_refresh_token, {
      ...eventDetails,
      attendeeEmail: student?.email ?? undefined,
    })
    updates.google_event_id_tutor = tutorEventId
  }

  if (!safeSession.google_event_id_student && studentProfile?.google_refresh_token) {
    const studentEventId = await createCalendarEvent(studentProfile.google_refresh_token, {
      ...eventDetails,
      attendeeEmail: tutor?.email ?? undefined,
    })
    updates.google_event_id_student = studentEventId
  }

  if (Object.keys(updates).length === 0) {
    return {
      synced: false,
      reason: 'No connected calendars or already synced events',
    }
  }

  const { error: updateError } = await service
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)

  if (updateError) {
    return { synced: false, reason: updateError.message }
  }

  return { synced: true }
}
