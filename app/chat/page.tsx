'use client'

import { useState, useCallback } from 'react'
import { useChatSessions } from '@/hooks/useChatSessions'
import ChatMessages, { Message } from '@/components/ChatMessages'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'

// Batasi history yang dikirim ke API agar tidak membengkak
const MAX_CONTEXT_MESSAGES = 20

export default function ChatPage() {
  const {
    sessions,
    activeId,
    activeSession,
    hydrated,
    setActiveId,
    createSession,
    updateSession,
    deleteSession,
    clearAll,
  } = useChatSessions()

  const [isLoading, setIsLoading] = useState(false)

  const handleSend = useCallback(
    async (text: string) => {
      let sessionId = activeId
      if (!sessionId) sessionId = createSession()

      const userMsg: Message = { role: 'user', content: text }

      // Tambah pesan user ke session
      updateSession(sessionId, (s) => ({
        ...s,
        title: s.messages.length === 0 ? text.slice(0, 35) : s.title,
        messages: [...s.messages, userMsg],
      }))

      setIsLoading(true)

      try {
        // Ambil history session yang ada + pesan baru
        const history = [
          ...(sessions.find((s) => s.id === sessionId)?.messages ?? []),
          userMsg,
        ]

        // Kirim MAX_CONTEXT_MESSAGES terakhir saja ke API
        const contextMessages = history.slice(-MAX_CONTEXT_MESSAGES)


        console.log('messages dikirim:', JSON.stringify(contextMessages, null, 2))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: contextMessages }),
        })

        if (!res.ok) {
          const err = await res.json()
          console.error('API error:', err)
          throw new Error(err.error)

        }

        // Tambah placeholder assistant untuk streaming
        updateSession(sessionId, (s) => ({
          ...s,
          messages: [...s.messages, { role: 'assistant', content: '' }],
        }))

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value)

          // Update konten streaming chunk per chunk
          updateSession(sessionId, (s) => ({
            ...s,
            messages: s.messages.map((m, i) =>
              i === s.messages.length - 1 ? { ...m, content: fullText } : m
            ),
          }))
        }
      } catch {
        updateSession(sessionId, (s) => ({
          ...s,
          messages: [
            ...s.messages,
            { role: 'assistant', content: 'Ups, ada error. Coba lagi ya! 🙏' },
          ],
        }))
      } finally {
        setIsLoading(false)
      }
    },
    [activeId, sessions, createSession, updateSession]
  )

  // Hindari hydration mismatch
  if (!hydrated) return null

  return (
    <div className="flex h-full bg-background">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={createSession}
        onDelete={deleteSession}
        onClearAll={clearAll}
      />
       <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <ChatMessages
          messages={activeSession?.messages ?? []}
          isLoading={isLoading}
        />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}