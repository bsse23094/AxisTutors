'use client'

import { useState } from 'react'

type AvatarUploadProps = {
  onUploaded?: (url: string) => void
}

export default function AvatarUpload({ onUploaded }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        type="file"
        accept="image/*"
        className="input"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setUploading(true)
          // Placeholder callback until full upload wiring is needed.
          onUploaded?.(URL.createObjectURL(file))
          setUploading(false)
        }}
      />
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{uploading ? 'Uploading...' : 'Select avatar'}</span>
    </div>
  )
}
