'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizonal } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

const QUICK_CHIPS = [
  '💰 Cara atur gaji pertama',
  '🏦 Berapa dana darurat ideal?',
  '📈 Investasi untuk pemula',
  '✂️ Tips hemat akhir bulan',
]

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
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
        {/* Quick chips — hanya muncul kalau belum ada input */}
        {!value && (
          <div className="flex gap-2 flex-wrap">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => onSend(chip)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-emerald-500 hover:text-emerald-600 text-muted-foreground transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya soal keuangan kamu..."
            rows={1}
            className="resize-none min-h-10.5 max-h-30 text-sm leading-relaxed"
          />
          <Button
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            size="icon"
            className="bg-emerald-600 hover:bg-emerald-700 h-10.5 w-10.5 shrink-0"
          >
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          Saran bersifat edukatif, bukan nasihat keuangan profesional resmi.
        </p>
      </div>
    </div>
  )
}