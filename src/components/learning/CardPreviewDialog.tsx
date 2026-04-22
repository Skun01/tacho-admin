import { useState } from 'react'
import { CheckCircleIcon, EyeIcon, WarningCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useCardPreview } from '@/hooks/useLearningAdminQueries'
import {
  FLASHCARD_CONTENT_TYPE_LABELS,
  FLASHCARD_CONTENT_TYPE_OPTIONS,
  MULTIPLE_CHOICE_QUESTION_TYPE_LABELS,
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
      <DialogContent
        className="
          max-w-[calc(100vw-1rem)] sm:max-w-4xl
          h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] max-h-[calc(100vh-1rem)] sm:max-h-[85vh]
          p-0 gap-0 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden
        "
      >
        <DialogHeader className="border-b px-6 py-4 pr-12">
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon />
            {C.title}
          </DialogTitle>
          <DialogDescription>{C.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 px-6 py-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="text-base">{C.configTitle}</CardTitle>
                    <CardDescription>{C.modeLabel}</CardDescription>
                  </div>
                  <Badge variant="secondary">{STUDY_MODE_LABELS[mode]}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={mode} onValueChange={(v) => setMode(v as StudyMode)} className="space-y-4">
                  <TabsList className="grid h-auto grid-cols-1 gap-2 md:grid-cols-3">
                    {STUDY_MODE_OPTIONS.map((studyMode) => (
                      <TabsTrigger key={studyMode} value={studyMode}>
                        {STUDY_MODE_LABELS[studyMode]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="FillInBlank" className="mt-0">
                    <Alert>
                      <CheckCircleIcon className="text-emerald-600" />
                      <AlertTitle>{STUDY_MODE_LABELS.FillInBlank}</AlertTitle>
                      <AlertDescription>{C.description}</AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="MultipleChoice" className="mt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{C.mcQuestionLabel}</Label>
                        <Select value={mcQuestion} onValueChange={(v) => setMcQuestion(v as MultipleChoiceQuestionType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MULTIPLE_CHOICE_QUESTION_TYPE_OPTIONS.map((questionType) => (
                              <SelectItem key={questionType} value={questionType}>
                                {MULTIPLE_CHOICE_QUESTION_TYPE_LABELS[questionType]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                        <Label>{C.shuffleLabel}</Label>
                        <Switch checked={shuffle} onCheckedChange={setShuffle} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="Flashcard" className="mt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{C.flashcardFrontLabel}</Label>
                        <Select value={fcFront} onValueChange={(v) => setFcFront(v as FlashcardContentType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FLASHCARD_CONTENT_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {FLASHCARD_CONTENT_TYPE_LABELS[option]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{C.flashcardBackLabel}</Label>
                        <Select value={fcBack} onValueChange={(v) => setFcBack(v as FlashcardContentType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FLASHCARD_CONTENT_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option} value={option}>
                                {FLASHCARD_CONTENT_TYPE_LABELS[option]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}

            {!isLoading && data && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{C.contentTitle}</CardTitle>
                  <CardDescription>{C.previewPromptLabel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border px-4 py-3">
                    <p className="text-sm font-medium">{data.prompt}</p>
                  </div>

                  <div className="space-y-3">
                    {data.questionText && (
                      <>
                        <DetailBlock label={C.questionLabel} value={data.questionText} highlight />
                        <Separator />
                      </>
                    )}
                    {data.secondaryText && (
                      <>
                        <DetailBlock label={C.secondaryLabel} value={data.secondaryText} />
                        <Separator />
                      </>
                    )}
                    {data.hint && (
                      <>
                        <DetailBlock label={C.hintLabel} value={data.hint} />
                        <Separator />
                      </>
                    )}
                    {data.frontText && (
                      <>
                        <DetailBlock label={C.frontLabel} value={data.frontText} highlight />
                        <Separator />
                      </>
                    )}
                    {data.backText && <DetailBlock label={C.backLabel} value={data.backText} />}
                  </div>

                  {data.options.length > 0 && (
                    <section className="space-y-2">
                      <Label>{C.optionsLabel}</Label>
                      <div className="space-y-2">
                        {data.options.map((option) => (
                          <div key={option.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
                            {option.isCorrect ? <CheckCircleIcon className="text-emerald-600" /> : <XCircleIcon className="text-muted-foreground" />}
                            <span className="flex-1 text-sm">{option.text}</span>
                            <Badge variant={option.isCorrect ? 'default' : 'secondary'}>
                              {option.isCorrect ? C.correctBadge : C.incorrectBadge}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="space-y-2">
                    <Label>{C.warningsLabel}</Label>
                    {data.warnings.length === 0 ? (
                      <Alert>
                        <CheckCircleIcon className="text-emerald-600" />
                        <AlertTitle>{C.warningsLabel}</AlertTitle>
                        <AlertDescription>{C.noWarningsLabel}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        {data.warnings.map((warning, index) => (
                          <Alert
                            key={`${warning}-${index}`}
                            variant="destructive"
                            className="border-destructive/30"
                            style={{ backgroundColor: 'var(--error-container, rgba(255,0,0,0.08))' }}
                          >
                            <WarningCircleIcon />
                            <AlertTitle>{C.warningsLabel}</AlertTitle>
                            <AlertDescription>{warning}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </section>
                </CardContent>
              </Card>
            )}

            {!isLoading && !data && (
              <Card>
                <CardContent className="px-4 py-6">
                  <Alert>
                    <WarningCircleIcon />
                    <AlertTitle>{C.title}</AlertTitle>
                    <AlertDescription>{C.noDataLabel}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {C.closeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailBlock({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="rounded-lg border px-3 py-2">
        <p className={highlight ? 'text-base font-semibold' : 'text-sm'}>{value}</p>
      </div>
    </div>
  )
}
