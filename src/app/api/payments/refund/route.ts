import { refundPayment } from '@/lib/payments'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type RefundRequest = {
  transactionId?: string
  amount?: number
  reason?: string
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admins can issue refunds' },
      { status: 403 }
    )
  }

  const body = (await request.json()) as RefundRequest
  if (!body.transactionId || !body.reason) {
    return NextResponse.json(
      { error: 'transactionId and reason are required' },
      { status: 400 }
    )
  }

  const { data: transaction } = await service
    .from('transactions')
    .select('id, status, session_id, gateway_transaction_id')
    .eq('id', body.transactionId)
    .single()

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  if (transaction.status !== 'captured' && transaction.status !== 'authorized') {
    return NextResponse.json(
      { error: 'Only captured or authorized transactions can be refunded' },
      { status: 400 }
    )
  }

  const refundResult = await refundPayment({
    transactionId: transaction.gateway_transaction_id ?? transaction.id,
    amount: body.amount,
    reason: body.reason,
  })

  if (!refundResult.success) {
    return NextResponse.json(
      { error: refundResult.error ?? 'Refund failed' },
      { status: 400 }
    )
  }

  await service
    .from('transactions')
    .update({
      status: 'refunded',
      gateway_response: { refunded: true, reason: body.reason, amount: body.amount },
    })
    .eq('id', transaction.id)

  if (transaction.session_id) {
    await service
      .from('sessions')
      .update({ status: 'refunded' })
      .eq('id', transaction.session_id)
  }

  return NextResponse.json({ success: true, status: 'refunded' })
}
