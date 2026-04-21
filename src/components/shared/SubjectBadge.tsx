interface SubjectBadgeProps {
  name: string
  level?: string
  size?: 'sm' | 'md'
}

export default function SubjectBadge({ name, level, size = 'md' }: SubjectBadgeProps) {
  const padding = size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.625rem'
  const fontSize = size === 'sm' ? '0.6875rem' : '0.75rem'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding,
      borderRadius: 'var(--radius-full)',
      background: 'var(--primary-50)',
      color: 'var(--primary)',
      fontSize,
      fontWeight: 500,
    }}>
      {name}
      {level && (
        <span style={{
          color: 'var(--primary-light)',
          fontSize: '0.625rem',
        }}>
          · {level}
        </span>
      )}
    </span>
  )
}
