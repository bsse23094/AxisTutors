import { SessionStatus } from '@/types'

const statusConfig: Record<string, { label: string; variant: string }> = {
  pending_payment: { label: 'Pending Payment', variant: 'badge-warning' },
  confirmed: { label: 'Confirmed', variant: 'badge-info' },
  completed: { label: 'Completed', variant: 'badge-success' },
  cancelled_student: { label: 'Cancelled', variant: 'badge-error' },
  cancelled_tutor: { label: 'Cancelled by Tutor', variant: 'badge-error' },
  disputed: { label: 'Disputed', variant: 'badge-error' },
  refunded: { label: 'Refunded', variant: 'badge-warning' },
}

export default function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const config = statusConfig[status] || { label: status, variant: 'badge-info' }
  return <span className={`badge ${config.variant}`}>{config.label}</span>
}
