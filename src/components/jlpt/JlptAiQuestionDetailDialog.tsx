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
  JLPT_LEVEL_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import type { AiGeneratedData, AiGeneratedQuestionResponse } from '@/types/jlptAdmin'

interface JlptAiQuestionDetailDialogProps {
  open: boolean
  item: AiGeneratedQuestionResponse
  isApproving: boolean
  isRejecting: boolean
  isEditing: boolean
  onOpenChange: (open: boolean) => void
  onApprove: () => void
  onReject: () => void
  onSaveEdit: (generatedData: string) => void
}

function tryParseGeneratedData(raw: string): AiGeneratedData | null {
  try {
    return JSON.parse(raw) as AiGeneratedData
  } catch {
    return null
  }
}

export function JlptAiQuestionDetailDialog({
  open,
  item,
  isApproving,
  isRejecting,
  isEditing,
  onOpenChange,
  onApprove,
  onReject,
  onSaveEdit,
}: JlptAiQuestionDetailDialogProps) {
  const parsed = useMemo(() => tryParseGeneratedData(item.generatedData), [item.generatedData])
  const initialJson = useMemo(() => JSON.stringify(parsed ?? item.generatedData, null, 2), [parsed, item.generatedData])

  const [isEditMode, setIsEditMode] = useState(false)
  const [editJson, setEditJson] = useState(initialJson)
  const [jsonError, setJsonError] = useState<string | null>(null)

  if (editJson !== initialJson && !isEditMode) {
    setEditJson(initialJson)
    setJsonError(null)
  }

  const handleSaveEdit = useCallback(() => {
    try {
      JSON.parse(editJson)
      setJsonError(null)
      onSaveEdit(editJson)
    } catch {
      setJsonError(JLPT_AI_QUESTION_CONTENT.invalidJsonError)
    }
  }, [editJson, onSaveEdit])

  const isPending = item.status === 'Pending' || item.status === 'Edited'
  const isBusy = isApproving || isRejecting || isEditing

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{JLPT_AI_QUESTION_CONTENT.detailTitle}</DialogTitle>
          <DialogDescription>{JLPT_AI_QUESTION_CONTENT.detailDescription}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{JLPT_LEVEL_LABELS[item.level]}</Badge>
            <Badge variant="outline">{SECTION_TYPE_LABELS[item.sectionType]}</Badge>
            <Badge variant={item.status === 'Approved' ? 'default' : 'secondary'}>
              {AI_QUESTION_STATUS_LABELS[item.status]}
            </Badge>
            {item.questionGroupId && (
              <Badge variant="outline">
                {JLPT_AI_QUESTION_CONTENT.questionGroupIdLabel}: {item.questionGroupId}
              </Badge>
            )}
          </div>

          <div className="text-sm">
            <span className="font-medium">{JLPT_AI_QUESTION_CONTENT.columns.topic}: </span>
            {item.topic}
          </div>

          {item.reviewerName && (
            <div className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_AI_QUESTION_CONTENT.reviewerInfo}: {item.reviewerName}
            </div>
          )}

          {/* Parsed content */}
          {!isEditMode && parsed && (
            <div className="space-y-3 rounded-lg border p-3">
              {parsed.passage && (
                <div>
                  <p className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.passageLabel}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{parsed.passage}</p>
                </div>
              )}
              {parsed.script && (
                <div>
                  <p className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.scriptLabel}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{parsed.script}</p>
                </div>
              )}

              {parsed.difficulty && (
                <div>
                  <p className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.difficultyLabel}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{parsed.difficulty.level}</Badge>
                    <span className="text-xs">{parsed.difficulty.score}/100</span>
                  </div>
                  {parsed.difficulty.reason && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>{parsed.difficulty.reason}</p>
                  )}
                </div>
              )}

              {parsed.metadata && (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.qualityScoreLabel}:</span>
                    <span className="text-xs">{parsed.metadata.qualityScore}/100</span>
                    {parsed.metadata.requiresManualReview && (
                      <Badge variant="secondary" className="text-xs">
                        <WarningIcon size={12} className="mr-1" />
                        {JLPT_AI_QUESTION_CONTENT.requiresReviewLabel}
                      </Badge>
                    )}
                  </div>
                  {parsed.metadata.validationWarnings.length > 0 && (
                    <ul className="list-inside list-disc text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {parsed.metadata.validationWarnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  )}
                  {parsed.metadata.duplicateCandidates.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.duplicatesLabel}</p>
                      <div className="mt-1 space-y-1">
                        {parsed.metadata.duplicateCandidates.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            <span>{d.previewText}</span>
                            <Badge variant="outline" className="text-xs">{Math.round(d.similarityScore * 100)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {parsed.questions && parsed.questions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold">{JLPT_AI_QUESTION_CONTENT.questionsLabel}</p>
                  <div className="mt-1 space-y-2">
                    {parsed.questions.map((q, idx) => (
                      <div key={idx} className="rounded border bg-muted/30 p-2">
                        <p className="text-sm font-medium">Q{idx + 1}. {q.questionText}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {q.options.map((opt, oi) => (
                            <Badge key={oi} variant={opt.isCorrect ? 'default' : 'outline'} className="text-xs">
                              {opt.label}. {opt.text}
                            </Badge>
                          ))}
                        </div>
                        {(q.skillTags?.length > 0 || q.difficultyScore != null) && (
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            {q.difficultyScore != null && (
                              <Badge variant="outline" className="text-xs">
                                {JLPT_AI_QUESTION_CONTENT.difficultyLabel}: {q.difficultyScore}/10
                              </Badge>
                            )}
                            {q.skillTags?.map((tag, ti) => (
                              <Badge key={ti} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        {q.explanation && (
                          <p className="mt-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JSON edit mode */}
          {isEditMode && (
            <div className="space-y-2">
              <Textarea
                value={editJson}
                onChange={(e) => setEditJson(e.target.value)}
                className="min-h-[200px] font-mono text-xs"
                rows={16}
              />
              {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 gap-2 pt-4">
          {isPending && !isEditMode && (
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditMode(true)} disabled={isBusy}>
              <PencilSimpleIcon size={16} />
              {JLPT_AI_QUESTION_CONTENT.editJsonLabel}
            </Button>
          )}

          {isEditMode && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => { setIsEditMode(false); setJsonError(null) }}>
                {JLPT_AI_QUESTION_CONTENT.cancelLabel}
              </Button>
              <Button type="button" size="sm" onClick={handleSaveEdit} disabled={isBusy}>
                {isEditing && <SpinnerGapIcon size={16} className="animate-spin" />}
                {JLPT_AI_QUESTION_CONTENT.saveEditLabel}
              </Button>
            </>
          )}

          {isPending && !isEditMode && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={onReject} disabled={isBusy}>
                {isRejecting && <SpinnerGapIcon size={16} className="animate-spin" />}
                <XIcon size={16} />
                {JLPT_AI_QUESTION_CONTENT.rejectLabel}
              </Button>
              <Button type="button" size="sm" onClick={onApprove} disabled={isBusy}>
                {isApproving && <SpinnerGapIcon size={16} className="animate-spin" />}
                <CheckIcon size={16} />
                {JLPT_AI_QUESTION_CONTENT.approveLabel}
              </Button>
            </>
          )}

          {!isPending && !isEditMode && (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {JLPT_AI_QUESTION_CONTENT.closeLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
