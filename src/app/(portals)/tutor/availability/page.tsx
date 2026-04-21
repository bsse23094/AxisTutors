'use client'

import type { Metadata } from 'next'
import { DAYS_OF_WEEK } from '@/lib/utils'
import { useState } from 'react'
import { Save, Clock } from 'lucide-react'

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, '0')
  return `${h}:00`
})

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Record<number, { start: string; end: string; active: boolean }>>({
    0: { start: '09:00', end: '17:00', active: false },
    1: { start: '09:00', end: '17:00', active: true },
    2: { start: '09:00', end: '17:00', active: true },
    3: { start: '09:00', end: '17:00', active: true },
    4: { start: '09:00', end: '17:00', active: true },
    5: { start: '09:00', end: '17:00', active: true },
    6: { start: '09:00', end: '14:00', active: true },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Availability</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Set your weekly recurring schedule</p>
        </div>
        <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DAYS_OF_WEEK.map((day, index) => {
            const slot = availability[index]
            return (
              <div key={day} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)',
                background: slot.active ? 'var(--surface-hover)' : 'transparent',
                border: `1px solid ${slot.active ? 'var(--primary-200)' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '140px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={slot.active}
                    onChange={() => setAvailability(prev => ({
                      ...prev,
                      [index]: { ...prev[index], active: !prev[index].active }
                    }))}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: slot.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {day}
                  </span>
                </label>

                {slot.active ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <select
                      className="select"
                      value={slot.start}
                      onChange={e => setAvailability(prev => ({
                        ...prev,
                        [index]: { ...prev[index], start: e.target.value }
                      }))}
                      style={{ width: 'auto' }}
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>to</span>
                    <select
                      className="select"
                      value={slot.end}
                      onChange={e => setAvailability(prev => ({
                        ...prev,
                        [index]: { ...prev[index], end: e.target.value }
                      }))}
                      style={{ width: 'auto' }}
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Unavailable</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
