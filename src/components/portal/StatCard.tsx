interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

export default function StatCard({ label, value, icon, color, change, changeType }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{
        background: `${color}14`,
        color: color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, fontFamily: 'Sora, DM Sans, sans-serif' }}>
          {value}
        </div>
        {change && (
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            marginTop: '0.25rem',
            color: changeType === 'positive' ? 'var(--success)' : changeType === 'negative' ? 'var(--error)' : 'var(--text-muted)',
          }}>
            {change}
          </div>
        )}
      </div>
    </div>
  )
}
