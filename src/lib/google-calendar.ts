import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export function getAuthUrl(userId: string, role: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
    state: JSON.stringify({ userId, role })
  })
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function createCalendarEvent(
  refreshToken: string,
  event: {
    summary: string
    description: string
    startDateTime: string
    endDateTime: string
    attendeeEmail?: string
    location?: string
  }
): Promise<string> {
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.startDateTime, timeZone: 'Asia/Karachi' },
      end: { dateTime: event.endDateTime, timeZone: 'Asia/Karachi' },
      attendees: event.attendeeEmail ? [{ email: event.attendeeEmail }] : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      }
    }
  })

  return response.data.id!
}

export async function deleteCalendarEvent(refreshToken: string, eventId: string) {
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  await calendar.events.delete({ calendarId: 'primary', eventId })
}
