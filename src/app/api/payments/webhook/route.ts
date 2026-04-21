import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHmac, timingSafeEqual } from 'crypto'

type PaymentWebhookPayload = {
  id?: string
  eventId?: string
  eventType?: string
  sessionId?: string
  transactionId?: string
  gatewayTransactionId?: string
  authorizationId?: string
}

function verifySignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET
  if (!secret) {
    return { valid: false, error: 'PAYMENT_WEBHOOK_SECRET is not configured' }
  }

  if (!signatureHeader) {
    return { valid: false, error: 'Missing signature' }
  }

  const providedSignature = signatureHeader.replace(/^sha256=/i, '').trim()
  const expectedSignature = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')

  const providedBuffer = Buffer.from(providedSignature, 'hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')

  if (
    providedBuffer.length === 0 ||
    expectedBuffer.length === 0 ||
    providedBuffer.length !== expectedBuffer.length
  ) {
    return { valid: false, error: 'Invalid signature format' }
  }

  const valid = timingSafeEqual(providedBuffer, expectedBuffer)
  return valid ? { valid: true } : { valid: false, error: 'Invalid signature' }
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-payment-signature')
  const rawBody = await request.text()
  const signatureCheck = verifySignature(rawBody, signature)

  if (!signatureCheck.valid) {
    const status = signatureCheck.error === 'PAYMENT_WEBHOOK_SECRET is not configured' ? 500 : 401
    return NextResponse.json({ error: signatureCheck.error }, { status })
  }

  let body: PaymentWebhookPayload | null = null
  try {
    body = rawBody ? (JSON.parse(rawBody) as PaymentWebhookPayload) : null
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!body) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const eventType = body.eventType
  const eventId = body.eventId ?? body.id
  const sessionId = body.sessionId
  const transactionLookupId =
    body.transactionId ?? body.gatewayTransactionId ?? body.authorizationId

  if (!eventType) {
    return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
  }

  const service = await createServiceClient()

  let transaction:
    | {
        id: string
        session_id: string | null
        status: string
        gateway_response: unknown
      }
    | null = null

  if (transactionLookupId) {
    const { data } = await service
      .from('transactions')
      .select('id, session_id, status, gateway_response')
      .or(`id.eq.${transactionLookupId},gateway_transaction_id.eq.${transactionLookupId}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    transaction = data
  }

  if (!transaction && sessionId) {
    const { data } = await service
      .from('transactions')
      .select('id, session_id, status, gateway_response')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    transaction = data
  }

  if (!transaction) {
    return NextResponse.json(
      { error: 'No matching transaction found for webhook payload' },
      { status: 404 }
    )
  }

  const gatewayResponse =
    transaction.gateway_response &&
    typeof transaction.gateway_response === 'object' &&
    !Array.isArray(transaction.gateway_response)
      ? (transaction.gateway_response as Record<string, unknown>)
      : {}

  const mergedGatewayResponse = {
    ...gatewayResponse,
    lastWebhookEvent: {
      eventId,
      eventType,
      receivedAt: new Date().toISOString(),
      payload: body,
    },
  }

  if (eventType === 'payment.captured') {
    if (transaction.status === 'captured') {
      return NextResponse.json({ success: true, idempotent: true, transactionId: transaction.id })
    }

    const { error } = await service
      .from('transactions')
      .update({ status: 'captured', gateway_response: mergedGatewayResponse })
      .eq('id', transaction.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (transaction.session_id) {
      await service
        .from('sessions')
        .update({ status: 'confirmed' })
        .eq('id', transaction.session_id)
        .eq('status', 'pending_payment')
    }

    return NextResponse.json({ success: true, transactionId: transaction.id, status: 'captured' })
  }

  if (eventType === 'payment.refunded') {
    if (transaction.status === 'refunded') {
      return NextResponse.json({ success: true, idempotent: true, transactionId: transaction.id })
    }

    const { error } = await service
      .from('transactions')
      .update({ status: 'refunded', gateway_response: mergedGatewayResponse })
      .eq('id', transaction.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, transactionId: transaction.id, status: 'refunded' })
  }

  if (eventType === 'payment.failed') {
    if (transaction.status === 'failed') {
      return NextResponse.json({ success: true, idempotent: true, transactionId: transaction.id })
    }

    const { error } = await service
      .from('transactions')
      .update({ status: 'failed', gateway_response: mergedGatewayResponse })
      .eq('id', transaction.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, transactionId: transaction.id, status: 'failed' })
  }

  return NextResponse.json({ success: true, ignored: true, eventType })
}
