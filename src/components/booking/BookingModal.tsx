'use client'

import { useState } from 'react'
import SlotPicker from './SlotPicker'

type BookingModalProps = {
  onConfirm?: (slot: string) => void
}

export default function BookingModal({ onConfirm }: BookingModalProps) {
  const [selected, setSelected] = useState<string | undefined>()
  const slots = [
    { label: 'Tomorrow 4:00 PM', value: 'tomorrow-16' },
    { label: 'Tomorrow 5:00 PM', value: 'tomorrow-17' },
  ]

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Book Session</h3>
      <SlotPicker slots={slots} selected={selected} onSelect={setSelected} />
      <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} disabled={!selected} onClick={() => selected && onConfirm?.(selected)}>
        Confirm Booking
      </button>
    </div>
  )
}
