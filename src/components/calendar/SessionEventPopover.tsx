type SessionEventPopoverProps = {
  title: string
  status: string
  start: string
  end: string
}

export default function SessionEventPopover({ title, status, start, end }: SessionEventPopoverProps) {
  return (
    <div className="card" style={{ padding: '0.875rem' }}>
      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.375rem' }}>{title}</h4>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status: {status}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {new Date(start).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })} - {new Date(end).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  )
}
