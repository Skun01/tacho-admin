import { CheckIcon, PencilSimpleIcon, SpinnerGapIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useMemo, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  AI_QUESTION_STATUS_LABELS,
  JLPT_AI_QUESTION_CONTENT,
} from '@/constants/jlptAdmin'
import type { AiGeneratedData, AiGeneratedQuestionResponse } from '@/types/jlptAdmin'

interface JlptAiGenerateResultDialogProps {
  open: boolean
  items: AiGeneratedQuestionResponse[]
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onSaveEdit: (id: string, generatedData: string) => Promise<void>
  approvingId: string | null
  rejectingId: string | null
  editingId: string | null
}

function tryParse(raw: string): AiGeneratedData | null {
  try {
    return JSON.parse(raw) as AiGeneratedData
  } catch {
    return null
  }
}

export function JlptAiGenerateResultDialog({
  open,
  items,
  onOpenChange,
  onApprove,
  onReject,
  onSaveEdit,
  approvingId,
  rejectingId,
  editingId,
}: JlptAiGenerateResultDialogProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editJson, setEditJson] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const pendingItems = useMemo(
    () => items.filter((i) => i.status === 'Pending' || i.status === 'Edited'),
    [items],
  )
  const allProcessed = pendingItems.length === 0

  const handleStartEdit = useCallback((item: AiGeneratedQuestionResponse) => {
    const parsed = tryParse(item.generatedData)
    setEditJson(JSON.stringify(parsed ?? item.generatedData, null, 2))
    setEditingItemId(item.id)
    setJsonError(null)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingItemId(null)
    setJsonError(null)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingItemId) return
    try {
      JSON.parse(editJson)
    } catch {
      setJsonError(JLPT_AI_QUESTION_CONTENT.invalidJsonError)
      return
    }
    setJsonError(null)
    await onSaveEdit(editingItemId, editJson)
    setEditingItemId(null)
  }, [editingItemId, editJson, onSaveEdit])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{JLPT_AI_QUESTION_CONTENT.generateAiResultTitle}</DialogTitle>
          <DialogDescription>{JLPT_AI_QUESTION_CONTENT.generateAiResultDescription}</DialogDescription>
        </DialogHeader>

        {!allProcessed && (
          <div className="shrink-0">
            <Badge variant="secondary">{JLPT_AI_QUESTION_CONTENT.pendingCountLabel(pendingItems.length)}</Badge>
          </div>
        )}

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {items.map((item) => {
            const parsed = tryParse(item.generatedData)
            const isPending = item.status === 'Pending' || item.status === 'Edited'
            const isEditingThis = editingItemId === item.id
            const isBusy = approvingId === item.id || rejectingId === item.id || editingId === item.id

            return (
              <div key={item.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'Approved' ? 'default' : item.status === 'Rejected' ? 'secondary' : 'outline'}>
                      {AI_QUESTION_STATUS_LABELS[item.status]}
                    </Badge>
                    <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{item.topic}</span>
                  </div>
                  {isPending && !isEditingThis && (
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEdit(item)} disabled={isBusy}>
                        <PencilSimpleIcon size={14} />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onReject(item.id)} disabled={isBusy}>
                        {rejectingId === item.id ? <SpinnerGapIcon size={14} className="animate-spin" /> : <XIcon size={14} />}
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onApprove(item.id)} disabled={isBusy}>
                        {approvingId === item.id ? <SpinnerGapIcon size={14} className="animate-spin" /> : <CheckIcon size={14} />}
                      </Button>
                    </div>
                  )}
                </div>

                {isEditingThis && (
                  <div className="space-y-2">
                    <Textarea
                      value={editJson}
                      onChange={(e) => setEditJson(e.target.value)}
                      className="min-h-[150px] font-mono text-xs"
                      rows={12}
                    />
                    {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                        {JLPT_AI_QUESTION_CONTENT.cancelLabel}
                      </Button>
                      <Button type="button" size="sm" onClick={handleSaveEdit} disabled={!!editingId}>
                        {editingId === item.id && <SpinnerGapIcon size={14} className="animate-spin" />}
                        {JLPT_AI_QUESTION_CONTENT.saveEditLabel}
                      </Button>
                    </div>
                  </div>
                )}

                {!isEditingThis && parsed && (
                  <div className="space-y-2">
                    {parsed.passage && (
                      <p className="text-xs whitespace-pre-wrap line-clamp-3" style={{ color: 'var(--on-surface-variant)' }}>
                        {parsed.passage}
                      </p>
                    )}

                    {parsed.difficulty && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{JLPT_AI_QUESTION_CONTENT.difficultyLabel}: {parsed.difficulty.level}</Badge>
                        <span className="text-xs">{parsed.difficulty.score}/100</span>
                      </div>
                    )}

                    {parsed.metadata && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs">{JLPT_AI_QUESTION_CONTENT.qualityScoreLabel}: {parsed.metadata.qualityScore}/100</span>
                        {parsed.metadata.requiresManualReview && (
                          <Badge variant="secondary" className="text-xs">
                            <WarningIcon size={12} className="mr-1" />
                            {JLPT_AI_QUESTION_CONTENT.requiresReviewLabel}
                          </Badge>
                        )}
                      </div>
                    )}

                    {parsed.questions && parsed.questions.length > 0 && (
                      <div className="space-y-1">
                        {parsed.questions.map((q, idx) => (
                          <div key={idx} className="rounded border bg-muted/30 p-2">
                            <p className="text-xs font-medium">Q{idx + 1}. {q.questionText}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {q.options.map((opt, oi) => (
                                <Badge key={oi} variant={opt.isCorrect ? 'default' : 'outline'} className="text-[10px]">
                                  {opt.label}. {opt.text}
                                </Badge>
                              ))}
                            </div>
                            {(q.skillTags?.length > 0 || q.difficultyScore != null) && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {q.difficultyScore != null && (
                                  <Badge variant="outline" className="text-[10px]">{q.difficultyScore}/10</Badge>
                                )}
                                {q.skillTags?.map((tag, ti) => (
                                  <Badge key={ti} variant="secondary" className="text-[10px]">{tag}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter className="shrink-0 pt-4">
          {allProcessed && (
            <p className="mr-auto text-sm font-medium" style={{ color: 'var(--primary)' }}>
              {JLPT_AI_QUESTION_CONTENT.allProcessedLabel}
            </p>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {JLPT_AI_QUESTION_CONTENT.closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
