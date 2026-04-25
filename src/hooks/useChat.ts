'use client'

// @ts-nocheck
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'

export function useChat(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    const supabase = createClient()

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (data) setMessages(data)
      setLoading(false)
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const sendMessage = useCallback(async (content: string, senderId: string) => {
    if (!roomId || !content.trim()) return

    const supabase = createClient()
    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: senderId,
      content: content.trim(),
    })
  }, [roomId])

  const sendFile = useCallback(async (file: File, senderId: string) => {
    if (!roomId) return

    const supabase = createClient()
    const filePath = `${roomId}/${Date.now()}_${file.name}`
    
    await supabase.storage.from('chat-attachments').upload(filePath, file)
    const { data: urlData } = supabase.storage.from('chat-attachments').getPublicUrl(filePath)

    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: senderId,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    })
  }, [roomId])

  return { messages, loading, sendMessage, sendFile }
}
