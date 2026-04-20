import { useState } from 'react'
import { EyeIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useCardPreview } from '@/hooks/useLearningAdminQueries'
import {
  FLASHCARD_CONTENT_TYPE_OPTIONS,
  MULTIPLE_CHOICE_QUESTION_TYPE_OPTIONS,
  STUDY_MODE_LABELS,
  STUDY_MODE_OPTIONS,
} from '@/types/learningAdmin'
import type {
  FlashcardContentType,
  LearningPreviewQuery,
  MultipleChoiceQuestionType,
  StudyMode,
} from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.preview

interface CardPreviewDialogProps {
  cardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardPreviewDialog({ cardId, open, onOpenChange }: CardPreviewDialogProps) {
  const [mode, setMode] = useState<StudyMode>('FillInBlank')
  const [mcQuestion, setMcQuestion] = useState<MultipleChoiceQuestionType>('TitleToSummary')
  const [fcFront, setFcFront] = useState<FlashcardContentType>('Title')
  const [fcBack, setFcBack] = useState<FlashcardContentType>('Summary')
  const [shuffle, setShuffle] = useState(false)

  const query: LearningPreviewQuery = {
    mode,
    ...(mode === 'MultipleChoice' && { multipleChoiceQuestion: mcQuestion, shuffleOptions: shuffle }),
    ...(mode === 'Flashcard' && { flashcardFront: fcFront, flashcardBack: fcBack }),
  }

  const { data, isLoading } = useCardPreview(cardId, query, open && Boolean(cardId))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon size={20} />
            {C.title}
          </DialogTitle>
          <DialogDescription>{C.description}</DialogDescription>
        </DialogHeader>

        {/* Mode selector */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">{C.modeLabel}</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as StudyMode)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STUDY_MODE_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>{STUDY_MODE_LABELS[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MC-specific options */}
          {mode === 'MultipleChoice' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{C.mcQuestionLabel}</Label>
                <Select value={mcQuestion} onValueChange={(v) => setMcQuestion(v as MultipleChoiceQuestionType)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MULTIPLE_CHOICE_QUESTION_TYPE_OPTIONS.map((q) => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Label className="text-xs">{C.shuffleLabel}</Label>
                <Switch checked={shuffle} onCheckedChange={setShuffle} />
              </div>
            </div>
          )}

          {/* FC-specific options */}
          {mode === 'Flashcard' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{C.flashcardFrontLabel}</Label>
                <Select value={fcFront} onValueChange={(v) => setFcFront(v as FlashcardContentType)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLASHCARD_CONTENT_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{C.flashcardBackLabel}</Label>
                <Select value={fcBack} onValueChange={(v) => setFcBack(v as FlashcardContentType)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLASHCARD_CONTENT_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {!isLoading && data && (
            <>
              {/* Prompt */}
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-container-lowest)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>{data.prompt}</p>
              </div>

              {/* Question text */}
              {data.questionText && (
                <div className="space-y-1">
                  <Label className="text-xs">{C.questionLabel}</Label>
                  <p className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>{data.questionText}</p>
                </div>
              )}

              {/* Secondary text */}
              {data.secondaryText && (
                <div className="space-y-1">
                  <Label className="text-xs">{C.secondaryLabel}</Label>
                  <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{data.secondaryText}</p>
                </div>
              )}

              {/* Hint */}
              {data.hint && (
                <div className="space-y-1">
                  <Label className="text-xs">{C.hintLabel}</Label>
                  <p className="text-sm italic" style={{ color: 'var(--on-surface-variant)' }}>{data.hint}</p>
                </div>
              )}

              {/* Flashcard front/back */}
              {data.frontText && (
                <div className="space-y-1">
                  <Label className="text-xs">{C.frontLabel}</Label>
                  <p className="text-lg font-bold" style={{ color: 'var(--on-surface)' }}>{data.frontText}</p>
                </div>
              )}
              {data.backText && (
                <div className="space-y-1">
                  <Label className="text-xs">{C.backLabel}</Label>
                  <p className="text-lg" style={{ color: 'var(--on-surface)' }}>{data.backText}</p>
                </div>
              )}

              {/* Options */}
              {data.options.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">{C.optionsLabel}</Label>
                  <div className="space-y-1.5">
                    {data.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                        style={{
                          borderColor: opt.isCorrect ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: opt.isCorrect ? 'var(--primary-container, rgba(0,128,0,0.08))' : 'transparent',
                        }}
                      >
                        <span className="flex-1">{opt.text}</span>
                        <Badge variant={opt.isCorrect ? 'default' : 'secondary'} className="text-xs">
                          {opt.isCorrect ? C.correctBadge : C.incorrectBadge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {data.warnings.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs">{C.warningsLabel}</Label>
                  <ul className="space-y-1">
                    {data.warnings.map((w, i) => (
                      <li key={i} className="text-xs rounded px-2 py-1" style={{ backgroundColor: 'var(--error-container, rgba(255,0,0,0.08))', color: 'var(--on-error-container, #c00)' }}>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {C.closeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
