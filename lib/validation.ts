export const LIMITS = {
  MAX_MESSAGE_LENGTH: 1000,       // karakter per pesan
  MAX_MESSAGES_PER_REQUEST: 20,   // maksimal history dikirim
  MAX_TOTAL_CHARS: 8000,          // total karakter semua messages
  MAX_REQUESTS_PER_MINUTE: 10,    // rate limit per IP
  MAX_REQUESTS_PER_HOUR: 40,      // rate limit per jam
}

// Pattern prompt injection yang umum
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions?/i,
  /forget\s+(everything|all|above|previous)/i,
  /you\s+are\s+now\s+a/i,
  /act\s+as\s+(a\s+)?(?!financial|keuangan)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /lupakan\s+(semua\s+)?(instruksi|perintah)/i,
  /kamu\s+sekarang\s+(adalah|merupakan)/i,
  /abaikan\s+(semua\s+)?(instruksi|perintah)/i,
  /system\s*prompt/i,
  /reveal\s+your\s+(prompt|instructions)/i,
  /show\s+me\s+your\s+(system|instructions)/i,
]

// Pattern Output Expansion Attack
const EXPANSION_PATTERNS = [
  /repeat\s+(this\s+)?\d{3,}/i,
  /write\s+\d{3,}\s+words/i,
  /tulis\s+\d{3,}\s+kata/i,
  /ulangi\s+\d{3,}/i,
  /print\s+this\s+\d+\s+times/i,
  /generate\s+\d{3,}/i,
]

type ValidationResult =
  | { ok: true }
  | { ok: false; error: string; status: number }

export function validateMessages(messages: unknown): ValidationResult {
  // Tipe dasar
  if (!Array.isArray(messages)) {
    return { ok: false, error: 'Format tidak valid.', status: 400 }
  }

  // Context Window Exhaustion — batasi jumlah pesan
  if (messages.length > LIMITS.MAX_MESSAGES_PER_REQUEST) {
    return {
      ok: false,
      error: `Maksimal ${LIMITS.MAX_MESSAGES_PER_REQUEST} pesan per request.`,
      status: 400,
    }
  }

  let totalChars = 0

  for (const msg of messages) {
    if (
      typeof msg !== 'object' ||
      msg === null ||
      !('role' in msg) ||
      !('content' in msg)
    ) {
      return { ok: false, error: 'Format pesan tidak valid.', status: 400 }
    }

    const { role, content } = msg as { role: unknown; content: unknown }

    if (!['user', 'assistant'].includes(role as string)) {
      return { ok: false, error: 'Role tidak valid.', status: 400 }
    }

    if (typeof content !== 'string') {
      return { ok: false, error: 'Konten harus berupa teks.', status: 400 }
    }

    // Token Bomb — batasi panjang per pesan
    if (content.length > LIMITS.MAX_MESSAGE_LENGTH) {
      return {
        ok: false,
        error: `Pesan terlalu panjang. Maksimal ${LIMITS.MAX_MESSAGE_LENGTH} karakter.`,
        status: 400,
      }
    }

    totalChars += content.length
  }

  // Context Window Exhaustion — batasi total karakter
  if (totalChars > LIMITS.MAX_TOTAL_CHARS) {
    return {
      ok: false,
      error: 'Total percakapan terlalu panjang.',
      status: 400,
    }
  }

  // Cek pesan terakhir dari user
  const lastMessage = messages[messages.length - 1] as { role: string; content: string }

  if (lastMessage.role === 'user') {
    const content = lastMessage.content

    // Prompt Injection
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(content)) {
        return {
          ok: false,
          error: 'Aku cuma bisa bantu soal keuangan ya! 😊',
          status: 400,
        }
      }
    }

    // Output Expansion Attack
    for (const pattern of EXPANSION_PATTERNS) {
      if (pattern.test(content)) {
        return {
          ok: false,
          error: 'Aku cuma bisa bantu soal keuangan ya! 😊',
          status: 400,
        }
      }
    }
  }

  return { ok: true }
}