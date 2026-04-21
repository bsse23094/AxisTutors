import { google } from 'googleapis'

type SendGmailOptions = {
  to: string
  subject: string
  html: string
  fromName?: string
}

function toBase64Url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function isGmailConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_SENDER_EMAIL
  )
}

export async function sendViaGmail({
  to,
  subject,
  html,
  fromName = 'Axis Tutors',
}: SendGmailOptions): Promise<{ id?: string }> {
  if (!isGmailConfigured()) {
    throw new Error('Gmail API is not configured')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_GMAIL_REFRESH_TOKEN,
  })

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  const sender = process.env.GMAIL_SENDER_EMAIL as string

  const mime = [
    `From: ${fromName} <${sender}>`,
    `To: ${to}`,
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html,
  ].join('\r\n')

  const { data } = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: toBase64Url(mime),
    },
  })

  return { id: data.id ?? undefined }
}
