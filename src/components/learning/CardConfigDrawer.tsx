import { useCallback, useEffect, useState } from 'react'
import { SpinnerGapIcon, PlusIcon, EyeIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useLearningCardConfig } from '@/hooks/useLearningAdminQueries'
import { useLearningAdminMutations } from '@/hooks/useLearningAdminMutations'
import { IssuesBadge } from '@/components/learning/IssuesBadge'
import { ReadinessBadges } from '@/components/learning/ReadinessBadges'
import { SentenceConfigRow } from '@/components/learning/SentenceConfigRow'
import { SentencePickerDialog } from '@/components/learning/SentencePickerDialog'
import { CardPreviewDialog } from '@/components/learning/CardPreviewDialog'
import type {
  CardConfigSentenceInput,
  LearningAdminCardSentenceConfigResponse,
} from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.cardConfig

interface CardConfigDrawerProps {
  cardId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardConfigDrawer({ cardId, open, onOpenChange }: CardConfigDrawerProps) {
  const { data, isLoading } = useLearningCardConfig(cardId ?? '', open && Boolean(cardId))
  const { updateCardConfigMutation, attachSentenceMutation, getApiErrorMessage } = useLearningAdminMutations()

  const [summary, setSummary] = useState('')
  const [sentences, setSentences] = useState<LearningAdminCardSentenceConfigResponse[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Sync from server
  useEffect(() => {
    if (!data) return
    setSummary(data.summary)
    setSentences(data.sentences)
  }, [data])

  const handleSentenceFieldChange = useCallback(
    (idx: number, field: keyof LearningAdminCardSentenceConfigResponse, value: unknown) => {
      setSentences((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
      )
    },
    [],
  )

  const handleRemoveSentence = useCallback((idx: number) => {
    setSentences((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleAttachSentence = async (sentenceId: string) => {
    if (!cardId) return
    const nextPosition = sentences.length + 1
    try {
      const result = await attachSentenceMutation.mutateAsync({
        cardId,
        payload: { sentenceId, position: nextPosition },
      })
      setSentences((prev) => [...prev, result])
      gooeyToast.success(ADMIN_LEARNING_CONTENT.toast.attachSentenceSuccess)
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, ADMIN_LEARNING_CONTENT.toast.attachSentenceError, ADMIN_LEARNING_CONTENT.errorCodes),
      )
    }
  }

  const handleSave = async () => {
    if (!cardId) return
    const sentenceInputs: CardConfigSentenceInput[] = sentences.map((s, idx) => ({
      sentenceId: s.sentenceId,
      position: idx + 1,
      blankWord: s.blankWord || null,
      hint: s.hint || null,
      answerList: s.answerList,
    }))

    try {
      await updateCardConfigMutation.mutateAsync({
        cardId,
        payload: { summary, sentences: sentenceInputs },
      })
      gooeyToast.success(ADMIN_LEARNING_CONTENT.toast.configSaveSuccess)
      onOpenChange(false)
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, ADMIN_LEARNING_CONTENT.toast.configSaveError, ADMIN_LEARNING_CONTENT.errorCodes),
      )
    }
  }

  const isSaving = updateCardConfigMutation.isPending

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="fixed right-0 top-0 bottom-0 w-full max-w-xl flex flex-col rounded-none border-l" style={{ backgroundColor: 'var(--surface)' }}>
          <DrawerHeader className="border-b px-6 py-4">
            <DrawerTitle>{C.drawerTitle}</DrawerTitle>
            <DrawerDescription>{data ? `${data.title} (${data.cardType})` : C.drawerDescription}</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {!isLoading && data && (
              <>
                {/* Readiness + Issues */}
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">{C.readinessTitle}</Label>
                    <ReadinessBadges modes={data.availableModes} />
                  </div>
                  <IssuesBadge issues={data.issues} />
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <Label>{C.summaryLabel}</Label>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={C.summaryPlaceholder}
                    rows={3}
                  />
                </div>

                {/* Sentences */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{C.sentencesTitle}</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                        <EyeIcon size={14} className="mr-1" />
                        {C.previewLabel}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                        <PlusIcon size={14} className="mr-1" />
                        {C.addSentenceLabel}
                      </Button>
                    </div>
                  </div>

                  {sentences.length === 0 && (
                    <p className="py-4 text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {C.sentencesEmptyLabel}
                    </p>
                  )}

                  {sentences.map((s, idx) => (
                    <SentenceConfigRow
                      key={s.sentenceId}
                      sentence={s}
                      onBlankWordChange={(v) => handleSentenceFieldChange(idx, 'blankWord', v)}
                      onHintChange={(v) => handleSentenceFieldChange(idx, 'hint', v)}
                      onAnswerListChange={(v) => handleSentenceFieldChange(idx, 'answerList', v)}
                      onRemove={() => handleRemoveSentence(idx)}
                    />
                  ))}
                </div>

                {/* Issues detail */}
                {data.issues.length > 0 && (
                  <div className="space-y-2">
                    <Label>{C.issuesTitle}</Label>
                    <div className="space-y-1.5">
                      {data.issues.map((issue, i) => (
                        <div key={i} className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: 'var(--error-container, rgba(255,0,0,0.06))', color: 'var(--on-error-container, #c00)' }}>
                          <span className="font-medium">{issue.type}</span>: {issue.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              {C.cancelLabel}
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaving || isLoading}>
              {isSaving && <SpinnerGapIcon size={16} className="mr-1 animate-spin" />}
              {C.saveConfigLabel}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Sub-dialogs */}
      {cardId && (
        <>
          <SentencePickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            excludeIds={sentences.map((s) => s.sentenceId)}
            onSelect={handleAttachSentence}
          />
          <CardPreviewDialog
            cardId={cardId}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
        </>
      )}
    </>
  )
}
