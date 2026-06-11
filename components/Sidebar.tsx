'use client'

import { MessageSquare, Plus, TrendingUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

type ChatSession = {
  id: string
  title: string
}

interface SidebarProps {
  sessions: ChatSession[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export default function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
}: SidebarProps) {
  return (
    <aside className="w-56 border-r bg-muted/30 flex flex-col py-4 px-3 gap-2 flex-shrink-0">
      <div className="flex items-center gap-2 px-2 pb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-sm">DuitPintar</span>
      </div>

      <Button onClick={onNew} variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
        <Plus className="w-3.5 h-3.5" />
        Chat baru
      </Button>

      {sessions.length > 0 && (
        <>
          <div className="flex items-center justify-between px-2 pt-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Riwayat</p>
            <button
              onClick={onClearAll}
              className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
            >
              Hapus semua
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    'group flex items-center gap-1 rounded-md transition-colors',
                    activeId === s.id
                      ? 'bg-background border border-border'
                      : 'hover:bg-background'
                  )}
                >
                  <button
                    onClick={() => onSelect(s.id)}
                    className="flex items-center gap-2 px-2 py-2 text-xs text-left flex-1 truncate"
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className={cn('truncate', activeId === s.id ? 'text-foreground' : 'text-muted-foreground')}>
                      {s.title}
                    </span>
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      <div className="mt-auto pt-2 border-t border-border flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Tampilan</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}