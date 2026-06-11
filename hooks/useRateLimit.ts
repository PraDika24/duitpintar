import { useState, useRef, useCallback } from 'react'
import { LIMITS } from '@/lib/validation'

export function useRateLimit() {
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')
  const requestTimes = useRef<number[]>([])

  const checkLimit = useCallback((): boolean => {
    const now = Date.now()
    const windowMs = 60 * 1000

    // Buang timestamp yang sudah lewat 1 menit
    requestTimes.current = requestTimes.current.filter(
      (t) => now - t < windowMs
    )

    if (requestTimes.current.length >= LIMITS.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = requestTimes.current[0]
      const waitSeconds = Math.ceil((oldestRequest + windowMs - now) / 1000)
      setBlockMessage(`Terlalu banyak pesan. Tunggu ${waitSeconds} detik ya.`)
      setIsBlocked(true)

      // Auto reset setelah waktu tunggu
      setTimeout(() => {
        setIsBlocked(false)
        setBlockMessage('')
      }, waitSeconds * 1000)

      return false
    }

    requestTimes.current.push(now)
    return true
  }, [])

  return { isBlocked, blockMessage, checkLimit }
}