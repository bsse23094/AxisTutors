type TopBarProps = {
  title: string
  subtitle?: string
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <div style={{ marginBottom: '1.45rem' }}>
      <h1 style={{ fontSize: '1.72rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{subtitle}</p>}
    </div>
  )
}
