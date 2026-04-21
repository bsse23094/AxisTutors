'use client'

import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

type ChatMessage = { id: string; content: string; createdAt?: string; mine?: boolean }

type ChatWindowProps = {
  messages: ChatMessage[]
  readOnly?: boolean
  onSend?: (text: string) => void
}

export default function ChatWindow({ messages, readOnly = false, onSend }: ChatWindowProps) {
  return (
    <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} content={m.content} createdAt={m.createdAt} mine={m.mine} />
        ))}
        {!messages.length && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No messages yet.</p>}
      </div>
      <ChatInput disabled={readOnly} onSend={onSend} />
    </div>
  )
}
