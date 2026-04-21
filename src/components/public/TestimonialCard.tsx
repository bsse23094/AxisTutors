type TestimonialCardProps = {
  name: string
  role: string
  quote: string
}

export default function TestimonialCard({ name, role, quote }: TestimonialCardProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{name}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{role}</div>
    </div>
  )
}
