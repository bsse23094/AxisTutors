import { emails } from '@/lib/email'
import { NextResponse } from 'next/server'

type ContactRequest = {
  name?: string
  email?: string
  inquiryType?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequest

    if (!body.name || !body.email || !body.inquiryType || !body.message) {
      return NextResponse.json(
        { error: 'name, email, inquiryType, and message are required' },
        { status: 400 }
      )
    }

    const supportEmail = process.env.SUPPORT_EMAIL ?? 'support@axistutors.pk'
    await emails.supportContact(
      supportEmail,
      body.name,
      body.email,
      body.inquiryType,
      body.message
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send contact request' },
      { status: 500 }
    )
  }
}
