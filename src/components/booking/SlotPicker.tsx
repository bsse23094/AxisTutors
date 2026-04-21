'use client'

type Slot = {
  label: string
  value: string
}

type SlotPickerProps = {
  slots: Slot[]
  selected?: string
  onSelect?: (value: string) => void
}

export default function SlotPicker({ slots, selected, onSelect }: SlotPickerProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {slots.map((slot) => (
        <button
          key={slot.value}
          type="button"
          className={`btn btn-sm ${selected === slot.value ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onSelect?.(slot.value)}
        >
          {slot.label}
        </button>
      ))}
    </div>
  )
}
