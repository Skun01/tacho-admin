import { useCallback, useState } from 'react'
import { CheckCircleIcon, EyeIcon, InfoIcon, PlusIcon, SpinnerGapIcon, WarningDiamondIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useLearningCardConfig } from '@/hooks/useLearningAdminQueries'
import { useLearningAdminMutations } from '@/hooks/useLearningAdminMutations'
import { ReadinessBadges } from '@/components/learning/ReadinessBadges'
import { SentenceConfigRow } from '@/components/learning/SentenceConfigRow'
import { SentencePickerDialog } from '@/components/learning/SentencePickerDialog'
import { CardPreviewDialog } from '@/components/learning/CardPreviewDialog'
import { CARD_TYPE_LABELS, LEARNING_ISSUE_TYPE_LABELS } from '@/types/learningAdmin'
import type {
  CardConfigSentenceInput,
  LearningAdminCardConfigResponse,
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[980px] w-full p-0 gap-0 flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <SheetHeader className="border-b px-6 py-4 pr-12">
          <SheetTitle>{C.drawerTitle}</SheetTitle>
          <SheetDescription>
            {data ? C.detailDescription(data.title, CARD_TYPE_LABELS[data.cardType]) : C.drawerDescription}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-6 py-4">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {!isLoading && data && cardId && (
              <CardConfigBody
                key={data.cardId}
                cardId={cardId}
                data={data}
                onClose={() => onOpenChange(false)}
              />
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface CardConfigBodyProps {
  cardId: string
  data: LearningAdminCardConfigResponse
  onClose: () => void
}

function CardConfigBody({ cardId, data, onClose }: CardConfigBodyProps) {
  const { updateCardConfigMutation, attachSentenceMutation, getApiErrorMessage } = useLearningAdminMutations()
  const isSaving = updateCardConfigMutation.isPending
  const [summary, setSummary] = useState(data.summary)
  const [sentences, setSentences] = useState<LearningAdminCardSentenceConfigResponse[]>(data.sentences)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSentenceFieldChange = useCallback(
    (idx: number, field: keyof LearningAdminCardSentenceConfigResponse, value: unknown) => {
      setSentences((prev) => prev.map((sentence, i) => (i === idx ? { ...sentence, [field]: value } : sentence)))
    },
    [],
  )

  const handleRemoveSentence = useCallback((idx: number) => {
    setSentences((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleAttachSentence = async (sentenceId: string) => {
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
    const sentenceInputs: CardConfigSentenceInput[] = sentences.map((sentence, idx) => ({
      sentenceId: sentence.sentenceId,
      position: idx + 1,
      blankWord: sentence.blankWord || null,
      hint: sentence.hint || null,
      answerList: sentence.answerList,
    }))

    try {
      await updateCardConfigMutation.mutateAsync({
        cardId,
        payload: { summary, sentences: sentenceInputs },
      })
      gooeyToast.success(ADMIN_LEARNING_CONTENT.toast.configSaveSuccess)
      onClose()
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, ADMIN_LEARNING_CONTENT.toast.configSaveError, ADMIN_LEARNING_CONTENT.errorCodes),
      )
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <Card>
            <CardHeader className="gap-3 pb-4">
              <CardTitle className="text-base">{C.summaryLabel}</CardTitle>
              <CardDescription>{data.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={C.summaryPlaceholder}
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">{C.sentencesTitle}</CardTitle>
                  <CardDescription>{C.sentencesCountLabel(sentences.length)}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                    <EyeIcon />
                    {C.previewLabel}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                    <PlusIcon />
                    {C.addSentenceLabel}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentences.length === 0 && (
                <div
                  className="rounded-lg border border-dashed px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--on-surface-variant)' }}
                >
                  {C.sentencesEmptyLabel}
                </div>
              )}

              {sentences.map((sentence, idx) => (
                <SentenceConfigRow
                  key={sentence.sentenceId}
                  sentence={sentence}
                  onBlankWordChange={(value) => handleSentenceFieldChange(idx, 'blankWord', value)}
                  onHintChange={(value) => handleSentenceFieldChange(idx, 'hint', value)}
                  onAnswerListChange={(value) => handleSentenceFieldChange(idx, 'answerList', value)}
                  onRemove={() => handleRemoveSentence(idx)}
                />
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{C.readinessTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReadinessBadges modes={data.availableModes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WarningDiamondIcon className="text-destructive" />
                  <CardTitle className="text-base">{C.issuesTitle}</CardTitle>
                </div>
                {data.issues.length > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground">{C.issueCountLabel(data.issues.length)}</Badge>
                )}
              </div>
              <CardDescription>{C.issuesSectionDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.issues.length === 0 && (
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <CheckCircleIcon className="shrink-0 text-emerald-600" size={18} />
                  <p className="text-sm">{C.noIssuesLabel}</p>
                </div>
              )}

              {data.issues.map((issue, i) => (
                <div
                  key={`${issue.type}-${issue.sentenceId ?? 'global'}-${i}`}
                  className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2.5"
                >
                  <WarningDiamondIcon className="mt-0.5 shrink-0 text-destructive" size={16} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        {LEARNING_ISSUE_TYPE_LABELS[issue.type]}
                      </Badge>
                      {issue.sentenceId && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {C.issueSentenceIdLabel(issue.sentenceId)}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{issue.message}</p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0"
                        aria-label={C.issuesTitle}
                      >
                        <InfoIcon size={14} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                      <PopoverHeader>
                        <PopoverTitle>{LEARNING_ISSUE_TYPE_LABELS[issue.type]}</PopoverTitle>
                        <PopoverDescription>{issue.message}</PopoverDescription>
                      </PopoverHeader>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>

      <div
        className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 border-t px-0 py-4"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
          {C.cancelLabel}
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving && <SpinnerGapIcon className="animate-spin" />}
          {C.saveConfigLabel}
        </Button>
      </div>

      <SentencePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        excludeIds={sentences.map((sentence) => sentence.sentenceId)}
        onSelect={handleAttachSentence}
      />
      <CardPreviewDialog
        cardId={cardId}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  )
}
