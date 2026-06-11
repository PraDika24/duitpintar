import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import { rateLimit } from '@/lib/rate-limit'
import { validateMessages, LIMITS } from '@/lib/validation'
import { headers } from 'next/headers'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const MODEL_FALLBACKS = [
  'gemini-3.5-flash',       
  'gemini-2.5-flash',       
  'gemini-2.0-flash',       
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',  
]

async function getIP(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    'anonymous'
  )
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export async function POST(req: Request) {
  const ip = getIP()

  // Rate limit — 10 request per menit
  const minuteLimit = rateLimit(`${ip}:minute`, {
    maxRequests: LIMITS.MAX_REQUESTS_PER_MINUTE,
    windowMs: 60 * 1000,
  })

  if (!minuteLimit.allowed) {
    const retryAfter = Math.ceil((minuteLimit.resetAt - Date.now()) / 1000)
    return new Response(
      JSON.stringify({ error: `Terlalu banyak request. Tunggu ${retryAfter} detik.` }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  // Rate limit — 40 request per jam
  const hourLimit = rateLimit(`${ip}:hour`, {
    maxRequests: LIMITS.MAX_REQUESTS_PER_HOUR,
    windowMs: 60 * 60 * 1000,
  })

  if (!hourLimit.allowed) {
    return errorResponse('Batas penggunaan per jam tercapai. Coba lagi nanti.', 429)
  }

  // Validasi ukuran body mentah — cegah request raksasa
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 50_000) {
    return errorResponse('Request terlalu besar.', 413)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse('Format request tidak valid.', 400)
  }

  const { messages } = body as { messages: unknown }

  // Validasi messages
  const validation = validateMessages(messages)
  if (!validation.ok) {
    return errorResponse(validation.error, validation.status)
  }

  const validMessages = messages as { role: string; content: string }[]

  const history = validMessages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const lastMessage = validMessages[validMessages.length - 1].content

  // Fallback model
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          maxOutputTokens: 1024,      // Cegah Infinite Generation Loop & Output Expansion
          temperature: 0.7,
          topP: 0.9,
        },
      })

      const chat = model.startChat({ history })
      const result = await chat.sendMessageStream(lastMessage)

      // Infinite Generation Loop — batasi total output
      let totalOutputChars = 0
      const MAX_OUTPUT_CHARS = 4000

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text()
              if (!text) continue

              totalOutputChars += text.length

              // Potong output kalau sudah terlalu panjang
              if (totalOutputChars > MAX_OUTPUT_CHARS) {
                controller.enqueue(encoder.encode('\n\n_(Respons dipotong karena terlalu panjang)_'))
                controller.close()
                return
              }

              controller.enqueue(encoder.encode(text))
            }
          } finally {
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'X-Model-Used': modelName,
          'X-RateLimit-Remaining': String(minuteLimit.remaining),
        },
      })
    } catch (err: unknown) {
      const status = (err as { status?: number }).status

      const is503 = status === 503

      if (is503 && modelName !== MODEL_FALLBACKS.at(-1)) {
        console.warn(`[chat] ${modelName} unavailable, trying next...`)
        continue
      }

  throw err
}
  }
}