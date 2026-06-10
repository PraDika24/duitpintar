'use client'

import { MessageSquare, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type ChatSession = {
  id: string
  title: string
}

interface SidebarProps {
  sessions: ChatSession[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}

export default function Sidebar({ sessions, activeId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="w-56 border-r bg-muted/30 flex flex-col py-4 px-3 gap-2 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-sm">DuitPintar</span>
      </div>

      <Button
        onClick={onNew}
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-xs"
      >
        <Plus className="w-3.5 h-3.5" />
        Chat baru
      </Button>

      {sessions.length > 0 && (
        <>
          <p className="text-[11px] text-muted-foreground px-2 pt-2 uppercase tracking-wide">
            Riwayat
          </p>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-2 rounded-md text-xs text-left w-full truncate transition-colors',
                    activeId === s.id
                      ? 'bg-background border border-border text-foreground'
                      : 'text-muted-foreground hover:bg-background'
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  )
}