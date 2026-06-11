import { track } from '@vercel/analytics'

export const trackEvent = {
  // Track ketika user kirim pesan
  messageSent: (chipUsed: boolean) =>
    track('message_sent', { chip_used: chipUsed }),

  // Track ketika user buka chat baru
  newChat: () => track('new_chat'),

  // Track ketika rate limit kena
  rateLimited: () => track('rate_limited'),

  // Track error dari API
  apiError: (model: string) => track('api_error', { model }),
}