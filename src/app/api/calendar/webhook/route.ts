import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const headers = request.headers
  const channelId = headers.get('x-goog-channel-id')
  const resourceId = headers.get('x-goog-resource-id')
  const resourceState = headers.get('x-goog-resource-state')
  const messageNumber = headers.get('x-goog-message-number')
  const channelToken = headers.get('x-goog-channel-token')
  const expectedChannelToken = process.env.GOOGLE_CALENDAR_WEBHOOK_TOKEN

  if (!channelId || !resourceId || !resourceState || !messageNumber) {
    return NextResponse.json(
      { error: 'Missing required Google webhook headers' },
      { status: 400 }
    )
  }

  if (expectedChannelToken && channelToken !== expectedChannelToken) {
    return NextResponse.json({ error: 'Invalid channel token' }, { status: 401 })
  }

  // Google sends a sync ping when a watch channel is first created.
  if (resourceState === 'sync') {
    return NextResponse.json({
      received: true,
      synced: true,
      channelId,
      resourceId,
      messageNumber,
    })
  }

  return NextResponse.json({
    received: true,
    channelId,
    resourceId,
    resourceState,
    messageNumber,
  })
}
