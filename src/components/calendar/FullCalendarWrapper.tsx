'use client'

type CalendarEvent = {
  id: string
  title: string
  start: string
  end: string
}

type FullCalendarWrapperProps = {
  events: CalendarEvent[]
}

export default function FullCalendarWrapper({ events }: FullCalendarWrapperProps) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Calendar</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {events.map((event) => (
          <div key={event.id} style={{ background: 'var(--surface-hover)', borderRadius: '8px', padding: '0.625rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{event.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {new Date(event.start).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        ))}
        {!events.length && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No events.</p>}
      </div>
    </div>
  )
}
