'use client'

import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  size?: number
  showValue?: boolean
}

export default function RatingStars({ rating, size = 16, showValue = true }: RatingStarsProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'star filled' : 'star'}
            fill={star <= Math.round(rating) ? '#FBBF24' : 'none'}
          />
        ))}
      </div>
      {showValue && (
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
