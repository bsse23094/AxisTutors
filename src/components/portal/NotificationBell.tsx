'use client'

import { Bell } from 'lucide-react'

type NotificationBellProps = {
  count?: number
}

export default function NotificationBell({ count = 0 }: NotificationBellProps) {
  return (
    <button className="btn btn-ghost" style={{ position: 'relative' }}>
      <Bell size={18} />
      {count > 0 && (
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          minWidth: '16px',
          height: '16px',
          borderRadius: '999px',
          background: 'var(--error)',
          color: 'white',
          fontSize: '0.625rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}>
          {count}
        </span>
      )}
    </button>
  )
}
