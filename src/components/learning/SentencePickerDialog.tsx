import { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { SentenceAdminItem } from '@/types/sentenceAdmin'

const C = ADMIN_LEARNING_CONTENT.sentencePicker

interface SentencePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  excludeIds: string[]
  onSelect: (sentenceId: string) => void
}

export function SentencePickerDialog({
  open,
  onOpenChange,
  excludeIds,
  onSelect,
}: SentencePickerDialogProps) {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<SentenceAdminItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!keyword.trim()) return
    setIsLoading(true)
    try {
      const response = await sentenceAdminService.search({
        q: keyword.trim(),
        page: 1,
        pageSize: 20,
      })
      const items = (response.data.data ?? []).filter((s) => !excludeIds.includes(s.id))
      setResults(items)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (sentenceId: string) => {
    onSelect(sentenceId)
    onOpenChange(false)
    setKeyword('')
    setResults([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{C.title}</DialogTitle>
          <DialogDescription>{C.description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={C.searchPlaceholder}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button type="button" size="sm" onClick={handleSearch} disabled={isLoading}>
            <MagnifyingGlassIcon size={16} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mt-2">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {!isLoading && results.length === 0 && keyword.trim() && (
            <p className="py-6 text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {C.emptyLabel}
            </p>
          )}

          {!isLoading &&
            results.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.text}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--on-surface-variant)' }}>
                    {s.meaning}
                  </p>
                </div>
                {s.level && (
                  <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: 'var(--surface-container-high)' }}>
                    {s.level}
                  </span>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => handleSelect(s.id)} className="shrink-0">
                  <PlusIcon size={14} className="mr-1" />
                  {C.attachLabel}
                </Button>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
