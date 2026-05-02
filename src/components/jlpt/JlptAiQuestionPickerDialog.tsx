import { CheckCircleIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  JLPT_EXAM_CONTENT,
  JLPT_LEVEL_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import { useJlptAiQuestionSearch } from '@/hooks/useJlptAdminQueries'
import type {
  AiGeneratedData,
  AiGeneratedQuestionResponse,
  JlptLevel,
  SectionType,
} from '@/types/jlptAdmin'

interface JlptAiQuestionPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: JlptLevel
  sectionType: SectionType
  onPick: (item: AiGeneratedQuestionResponse, parsed: AiGeneratedData) => void
}

function tryParse(raw: string): AiGeneratedData | null {
  try {
    return JSON.parse(raw) as AiGeneratedData
  } catch {
    return null
  }
}

export function JlptAiQuestionPickerDialog({
  open,
  onOpenChange,
  level,
  sectionType,
  onPick,
}: JlptAiQuestionPickerDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const { data, isLoading, isFetching } = useJlptAiQuestionSearch(
    { level, sectionType, status: 'Approved', page: 1, pageSize: 50 },
    open,
  )

  const items = data?.items ?? []
  const isBusy = isLoading || isFetching

  function handleConfirm() {
    setParseError(null)
    const item = items.find((x) => x.id === selectedId)
    if (!item) return
    const parsed = tryParse(item.generatedData)
    if (!parsed || !parsed.questions || parsed.questions.length === 0) {
      setParseError(JLPT_EXAM_CONTENT.pickAiQuestionInvalidData)
      return
    }
    onPick(item, parsed)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{JLPT_EXAM_CONTENT.pickAiQuestionTitle}</DialogTitle>
          <DialogDescription>{JLPT_EXAM_CONTENT.pickAiQuestionDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 pb-2">
          <Badge variant="outline">{JLPT_LEVEL_LABELS[level]}</Badge>
          <Badge variant="outline">{SECTION_TYPE_LABELS[sectionType]}</Badge>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {isBusy && (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          {!isBusy && items.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_EXAM_CONTENT.pickAiQuestionEmpty}
            </p>
          )}

          {!isBusy && items.map((item) => {
            const parsed = tryParse(item.generatedData)
            const firstQ = parsed?.questions?.[0]
            const isSelected = selectedId === item.id
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => { setSelectedId(item.id); setParseError(null) }}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition hover:bg-muted/40 ${isSelected ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
                  {isSelected && <CheckCircleIcon size={20} weight="fill" className="text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{item.topic}</Badge>
                    <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium">
                    {firstQ?.questionText ?? '—'}
                  </p>
                  {firstQ?.options && (
                    <p className="mt-1 line-clamp-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {firstQ.options.map((o) => `${o.label}. ${o.text}`).join(' · ')}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {parseError && (
          <p className="text-xs text-destructive">{parseError}</p>
        )}

        <DialogFooter className="shrink-0 pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {JLPT_EXAM_CONTENT.cancelLabel}
          </Button>
          <Button type="button" disabled={!selectedId || isBusy} onClick={handleConfirm}>
            {isBusy && <SpinnerGapIcon size={16} className="animate-spin" />}
            {JLPT_EXAM_CONTENT.pickAiQuestionConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
