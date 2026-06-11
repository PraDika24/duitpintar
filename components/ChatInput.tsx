'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizonal, AlertCircle } from 'lucide-react'
import { useRateLimit } from '@/hooks/useRateLimit'
import { LIMITS } from '@/lib/validation'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

const QUICK_CHIPS = [
  'Cara atur gaji pertama',
  'Berapa dana darurat ideal?',
  'Investasi untuk pemula',
  'Tips hemat akhir bulan',
]

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isBlocked, blockMessage, checkLimit } = useRateLimit()

  const remaining = LIMITS.MAX_MESSAGE_LENGTH - value.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 100 && remaining >= 0

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || isBlocked || isOverLimit) return
    if (!checkLimit()) return
    onSend(trimmed)
    setValue('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">

        {/* Quick chips */}
        {!value && !isBlocked && (
          <div className="flex gap-2 flex-wrap">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  if (!checkLimit()) return
                  onSend(chip)
                }}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-emerald-500 hover:text-emerald-600 text-muted-foreground transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Rate limit warning */}
        {isBlocked && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {blockMessage}
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 flex flex-col gap-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya soal keuangan kamu..."
              rows={1}
              disabled={isBlocked}
              className="resize-none min-h-[42px] max-h-[120px] text-sm leading-relaxed disabled:opacity-50"
            />
            {/* Counter karakter */}
            {(isNearLimit || isOverLimit) && (
              <p className={`text-[11px] text-right ${isOverLimit ? 'text-red-500' : 'text-amber-500'}`}>
                {isOverLimit ? `${Math.abs(remaining)} karakter melebihi batas` : `${remaining} karakter tersisa`}
              </p>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!value.trim() || isLoading || isBlocked || isOverLimit}
            size="icon"
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-[42px] w-[42px] flex-shrink-0 disabled:opacity-50"
          >
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          Saran bersifat edukatif — bukan nasihat keuangan profesional resmi.
        </p>
      </div>
    </div>
  )
}