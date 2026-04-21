import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Messages' }

const chatList = [
  { id: '1', name: 'Ali Hassan', lastMessage: 'Thank you for the great session!', time: '2 min ago', unread: 2, avatar: 'AH' },
  { id: '2', name: 'Sara Malik', lastMessage: 'Can we reschedule tomorrow?', time: '1 hour ago', unread: 0, avatar: 'SM' },
  { id: '3', name: 'Usman Ali', lastMessage: 'I have a question about chapter 5', time: '3 hours ago', unread: 1, avatar: 'UA' },
  { id: '4', name: 'Hamza Tariq', lastMessage: 'See you on Wednesday!', time: 'Yesterday', unread: 0, avatar: 'HT' },
]

export default function TutorChatPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Messages</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Chat with your students</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1rem', minHeight: '500px' }}>
        {/* Chat List */}
        <div className="card" style={{ padding: '0.5rem', overflow: 'auto' }}>
          {chatList.map(chat => (
            <div key={chat.id} className="chat-row" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', transition: 'background 0.15s',
            }}>
              <div className="avatar avatar-md" style={{ background: 'var(--primary)', color: 'white' }}>
                {chat.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{chat.name}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <span style={{
                      minWidth: '1.125rem', height: '1.125rem', borderRadius: 'var(--radius-full)',
                      background: 'var(--primary)', color: 'white', fontSize: '0.6875rem',
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: '0.5rem', flexShrink: 0,
                    }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window placeholder */}
        <div className="card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)',
        }}>
          <MessageSquare size={40} />
          <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Select a conversation to start chatting</p>
          <p style={{ fontSize: '0.8125rem' }}>Powered by Supabase Realtime</p>
        </div>
      </div>

      <style>{`
        .chat-row:hover {
          background: var(--surface-hover);
        }
      `}</style>
    </div>
  )
}
