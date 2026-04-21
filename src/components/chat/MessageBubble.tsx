type MessageBubbleProps = {
  content: string
  mine?: boolean
  createdAt?: string
}

export default function MessageBubble({ content, mine = false, createdAt }: MessageBubbleProps) {
  return (
    <div style={{
      alignSelf: mine ? 'flex-end' : 'flex-start',
      maxWidth: '75%',
      background: mine ? 'var(--primary-50)' : 'var(--surface-hover)',
      borderRadius: '10px',
      padding: '0.625rem 0.75rem',
    }}>
      <div style={{ fontSize: '0.875rem' }}>{content}</div>
      {createdAt && <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{createdAt}</div>}
    </div>
  )
}
