'use client'

import { useState } from 'react'

type ChatInputProps = {
  onSend?: (text: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('')

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? 'Read-only chat' : 'Type a message'}
        disabled={disabled}
      />
      <button
        className="btn btn-primary"
        disabled={disabled || !text.trim()}
        onClick={() => {
          onSend?.(text.trim())
          setText('')
        }}
      >
        Send
      </button>
    </div>
  )
}
