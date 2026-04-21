import { capturePayment } from '@/lib/payments'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type CaptureRequest = {
  transactionId?: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const service = await createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as CaptureRequest
  if (!body.transactionId) {
    return NextResponse.json({ error: 'transactionId is required' }, { status: 400 })
  }

  const { data: transaction } = await service
    .from('transactions')
    .select('id, parent_id, status, gateway_transaction_id')
    .eq('id', body.transactionId)
    .single()

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  if (transaction.parent_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (transaction.status !== 'authorized' || !transaction.gateway_transaction_id) {
    return NextResponse.json(
      { error: 'Transaction is not in an authorizable state' },
      { status: 400 }
    )
  }

  const result = await capturePayment({
    authorizationId: transaction.gateway_transaction_id,
  })

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? 'Payment capture failed' },
      { status: 400 }
    )
  }

  const { error } = await service
    .from('transactions')
    .update({
      status: 'captured',
      gateway_response: {
        capturedTransactionId: result.transactionId,
      },
    })
    .eq('id', transaction.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, transactionId: transaction.id, status: 'captured' })
}
