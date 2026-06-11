'use client'

import { useState, useEffect, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { Message } from '@/components/ChatMessages'

type Session = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

const STORAGE_KEY = 'duitpintar_sessions'
const ACTIVE_KEY = 'duitpintar_active_id'

export function useChatSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
})

const [activeId, setActiveId] = useState<string | null>(() => {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
})
  const [hydrated, setHydrated] = useState(false)

  // Load dari localStorage saat pertama mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const savedActive = localStorage.getItem(ACTIVE_KEY)
      if (raw) setSessions(JSON.parse(raw))
      if (savedActive) setActiveId(savedActive)
    } catch {}
    setHydrated(true)
  }, [])

  // Sync ke localStorage setiap kali sessions berubah
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch {}
  }, [sessions, hydrated])

  // Sync activeId ke localStorage
  useEffect(() => {
    if (!hydrated) return
    try {
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
      else localStorage.removeItem(ACTIVE_KEY)
    } catch {}
  }, [activeId, hydrated])

  const createSession = useCallback(() => {
    const id = nanoid()
    const newSession: Session = {
      id,
      title: 'Chat baru',
      messages: [],
      createdAt: Date.now(),
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveId(id)
    return id
  }, [])

  const updateSession = useCallback((id: string, updater: (s: Session) => Session) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)))
  }, [])

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeId === id) setActiveId(null)
    },
    [activeId]
  )

  const clearAll = useCallback(() => {
    setSessions([])
    setActiveId(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ACTIVE_KEY)
  }, [])

  const activeSession = sessions.find((s) => s.id === activeId) ?? null

  return {
    sessions,
    activeId,
    activeSession,
    hydrated,
    setActiveId,
    createSession,
    updateSession,
    deleteSession,
    clearAll,
  }
}