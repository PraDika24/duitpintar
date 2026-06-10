'use client'

import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import ChatMessages, { Message } from '@/components/ChatMessages'
import ChatInput from '@/components/ChatInput'
import Sidebar from '@/components/Sidebar'

type Session = {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const activeSession = sessions.find((s) => s.id === activeId)
  const messages = activeSession?.messages ?? []

  const createSession = useCallback(() => {
    const id = nanoid()
    setSessions((prev) => [...prev, { id, title: 'Chat baru', messages: [] }])
    setActiveId(id)
    return id
  }, [])

  const handleSend = useCallback(
    async (text: string) => {
      // Buat session baru kalau belum ada
      let sessionId = activeId
      if (!sessionId) sessionId = createSession()

      const userMsg: Message = { role: 'user', content: text }

      // Tambah pesan user
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                // Judul sesi = 30 karakter pertama dari pesan pertama
                title: s.messages.length === 0 ? text.slice(0, 30) : s.title,
                messages: [...s.messages, userMsg],
              }
            : s
        )
      )

      setIsLoading(true)

      try {
        const currentMessages = [
          ...(sessions.find((s) => s.id === sessionId)?.messages ?? []),
          userMsg,
        ]

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: currentMessages }),
        })

        if (!res.ok) throw new Error('API error')

        // Baca streaming
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        // Tambah placeholder assistant
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, { role: 'assistant', content: '' }] }
              : s
          )
        )

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value)

          // Update chunk per chunk
          setSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    messages: s.messages.map((m, i) =>
                      i === s.messages.length - 1
                        ? { ...m, content: fullText }
                        : m
                    ),
                  }
                : s
            )
          )
        }
      } catch (err) {
        console.error(err)
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [
                    ...s.messages,
                    { role: 'assistant', content: 'Ups, ada error. Coba lagi ya! 🙏' },
                  ],
                }
              : s
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [activeId, sessions, createSession]
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={createSession}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  )
}