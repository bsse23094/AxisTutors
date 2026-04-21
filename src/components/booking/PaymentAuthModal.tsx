type PaymentAuthModalProps = {
  amount: number
  onApprove?: () => void
}

export default function PaymentAuthModal({ amount, onApprove }: PaymentAuthModalProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Parent Payment Approval</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Amount: PKR {amount.toLocaleString()}</p>
      <button className="btn btn-primary" onClick={onApprove}>Approve & Pay</button>
    </div>
  )
}
