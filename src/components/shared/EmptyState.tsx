import { Search } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '4rem',
        height: '4rem',
        borderRadius: 'var(--radius-full)',
        background: 'var(--primary-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        color: 'var(--primary)',
      }}>
        {icon || <Search size={24} />}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '24rem', marginBottom: action ? '1.5rem' : 0 }}>
        {description}
      </p>
      {action}
    </div>
  )
}
