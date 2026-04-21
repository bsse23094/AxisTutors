// lib/payments.ts
// This is a placeholder. Replace the implementation when payment method is decided.
// The interface must stay the same to avoid breaking calling code.

export interface PaymentAuthorizeParams {
  amount: number           // in PKR paisa (e.g. 150000 = PKR 1500)
  currency: string         // 'PKR'
  customerId: string       // parent's payment_customer_id
  sessionId: string
  description: string
}

export interface PaymentCaptureParams {
  authorizationId: string
}

export interface PaymentRefundParams {
  transactionId: string
  amount?: number          // partial refund if specified
  reason: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  authorizationId?: string
  error?: string
}

// PLACEHOLDER IMPLEMENTATION — replace with real gateway (JazzCash / EasyPaisa / Stripe)
export async function authorizePayment(params: PaymentAuthorizeParams): Promise<PaymentResult> {
  console.warn('Payment gateway not configured. Using mock authorization.')
  return {
    success: true,
    authorizationId: `mock_auth_${Date.now()}_${params.sessionId}`,
  }
}

export async function capturePayment(params: PaymentCaptureParams): Promise<PaymentResult> {
  console.warn('Payment gateway not configured. Using mock capture.')
  return {
    success: true,
    transactionId: `mock_txn_${Date.now()}`,
  }
}

export async function refundPayment(params: PaymentRefundParams): Promise<PaymentResult> {
  console.warn('Payment gateway not configured. Using mock refund.')
  return { success: true }
}
