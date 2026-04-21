'use client'

import { useState } from 'react'

type SearchFiltersProps = {
  onApply?: (filters: { query: string; city: string; minRate: string; maxRate: string }) => void
}

export default function SearchFilters({ onApply }: SearchFiltersProps) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')

  return (
    <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <input className="input" placeholder="Subject or tutor" value={query} onChange={(e) => setQuery(e.target.value)} />
      <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <input className="input" placeholder="Min rate" value={minRate} onChange={(e) => setMinRate(e.target.value)} />
        <input className="input" placeholder="Max rate" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={() => onApply?.({ query, city, minRate, maxRate })}>Apply</button>
    </div>
  )
}
