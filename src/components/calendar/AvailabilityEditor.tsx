'use client'

import { useState } from 'react'

type Slot = { day_of_week: number; start_time: string; end_time: string }

type AvailabilityEditorProps = {
  initialSlots?: Slot[]
}

export default function AvailabilityEditor({ initialSlots = [] }: AvailabilityEditorProps) {
  const [slots] = useState(initialSlots)

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Availability</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {slots.map((slot, index) => (
          <div key={index} style={{ background: 'var(--surface-hover)', borderRadius: '8px', padding: '0.625rem' }}>
            Day {slot.day_of_week}: {slot.start_time} - {slot.end_time}
          </div>
        ))}
        {!slots.length && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No slots configured.</p>}
      </div>
    </div>
  )
}
