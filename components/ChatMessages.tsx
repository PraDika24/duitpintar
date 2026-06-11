'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

function MarkdownContent({ content, isUser }: { content: string; isUser?: boolean }) {
  const codeBg = isUser ? 'bg-white/20' : 'bg-black/10'
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <span className="font-medium">{children}</span>
        ),
        em: ({ children }) => (
          <em className="italic opacity-80">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="mt-1 mb-2 flex flex-col gap-1.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-1 mb-2 flex flex-col gap-1.5 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 items-start">
            <span className="mt-2 w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-50" />
            <span className="flex-1">{children}</span>
          </li>
        ),
        h1: ({ children }) => <p className="font-medium text-base mt-3 mb-1">{children}</p>,
        h2: ({ children }) => <p className="font-medium mt-3 mb-1">{children}</p>,
        h3: ({ children }) => <p className="font-medium mt-2 mb-1 opacity-90">{children}</p>,
        blockquote: ({ children }) => (
          <div className="border-l-2 border-current opacity-70 pl-3 my-2 italic">{children}</div>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-')
          if (isBlock) {
            return (
              <pre className={`${codeBg} rounded-lg px-3 py-2 my-2 text-xs overflow-x-auto`}>
                <code>{children}</code>
              </pre>
            )
          }
          return (
            <code className={`${codeBg} rounded px-1 py-0.5 text-xs font-mono`}>
              {children}
            </code>
          )
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="text-xs w-full border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-current/20 px-2 py-1 text-left font-medium opacity-80">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border border-current/20 px-2 py-1">{children}</td>
        ),
        hr: () => <hr className="border-current/20 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll container itu sendiri — bukan scrollIntoView
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isLoading])

  return (
    // Native scroll — bukan ScrollArea
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto min-h-0 px-4 py-6"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-base font-medium text-foreground mb-1">
              Halo! Aku DuitPintar 👋
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Tanya apa aja soal keuangan — budgeting, nabung, investasi, atau dana darurat.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3 items-start',
              msg.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                msg.role === 'assistant'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-muted text-muted-foreground border border-border'
              )}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 text-sm max-w-[80%]',
                msg.role === 'assistant'
                  ? 'bg-muted text-foreground rounded-tl-sm'
                  : 'bg-emerald-600 text-white rounded-tr-sm'
              )}
            >
              {msg.content ? (
                <MarkdownContent content={msg.content} isUser={msg.role === 'user'} />
              ) : (
                <span className="opacity-40 text-xs">...</span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}