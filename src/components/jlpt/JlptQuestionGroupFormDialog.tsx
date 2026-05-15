import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon, UploadSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  CHOUKAI_MONDAI_TYPE_LABELS,
  JLPT_EXAM_CONTENT,
} from '@/constants/jlptAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import {
  questionGroupSchema,
  type QuestionGroupFormValues,
} from '@/lib/validations/jlptAdmin'
import type { ChoukaiMondaiType, QuestionGroupResponse, SectionType } from '@/types/jlptAdmin'

interface CreateProps {
  mode: 'create'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  nextOrderIndex: number
  sectionType: SectionType
  onSubmit: (payload: {
    instruction: string
    passageText?: string | null
    audioScript?: string | null
    audioFile?: File | null
    orderIndex: number
    mondaiType?: ChoukaiMondaiType | null
  }) => Promise<void>
}

interface EditProps {
  mode: 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  group: QuestionGroupResponse
  sectionType: SectionType
  onSubmit: (payload: {
    instruction: string
    passageText?: string | null
    audioScript?: string | null
    audioFile?: File | null
    orderIndex: number
    mondaiType?: ChoukaiMondaiType | null
  }) => Promise<void>
}

type JlptGroupFormDialogProps = CreateProps | EditProps

function buildCreateDefaults(orderIndex: number): QuestionGroupFormValues {
  return { instruction: '', passageText: '', audioScript: '', audioFile: null, orderIndex, mondaiType: null }
}

function buildEditDefaults(group: QuestionGroupResponse): QuestionGroupFormValues {
  return {
    instruction: group.instruction,
    passageText: group.passageText ?? '',
    audioScript: group.audioScript ?? '',
    audioFile: null,
    orderIndex: group.orderIndex,
    mondaiType: group.mondaiType,
  }
}

export function JlptQuestionGroupFormDialog(props: JlptGroupFormDialogProps) {
  const isCreateMode = props.mode === 'create'
  const sectionType = props.sectionType
  const isDokkai = sectionType === 'Dokkai'
  const isChoukai = sectionType === 'Choukai'

  const [removeAudio, setRemoveAudio] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<QuestionGroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionGroupSchema) as any,
    defaultValues: isCreateMode ? buildCreateDefaults(props.nextOrderIndex) : buildEditDefaults(props.group),
  })

  useEffect(() => {
    setRemoveAudio(false)
    if (isCreateMode) {
      form.reset(buildCreateDefaults(props.nextOrderIndex))
      return
    }
    form.reset(buildEditDefaults(props.group))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: QuestionGroupFormValues) {
    await props.onSubmit({
      instruction: values.instruction.trim(),
      passageText: isDokkai ? (values.passageText?.trim() || null) : null,
      audioScript: isChoukai ? (values.audioScript?.trim() || null) : null,
      audioFile: isChoukai ? (values.audioFile ?? null) : null,
      orderIndex: values.orderIndex,
      mondaiType: isChoukai ? (values.mondaiType ?? null) : null,
    })
    if (isCreateMode) {
      form.reset(buildCreateDefaults(props.nextOrderIndex))
      setRemoveAudio(false)
    }
  }

  const selectedMondai = useWatch({ control: form.control, name: 'mondaiType' })
  const audioFile = useWatch({ control: form.control, name: 'audioFile' })

  const existingAudioUrl = !isCreateMode ? props.group.audioUrl : null
  const showExistingAudio = existingAudioUrl && !removeAudio && !audioFile

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isCreateMode ? JLPT_EXAM_CONTENT.createGroupTitle : JLPT_EXAM_CONTENT.editGroupTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.instructionFieldLabel}</FormLabel>
                    <FormControl><Textarea {...field} placeholder={JLPT_EXAM_CONTENT.instructionFieldPlaceholder} rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isDokkai && (
                <FormField
                  control={form.control}
                  name="passageText"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{JLPT_EXAM_CONTENT.passageTextFieldLabel}</FormLabel>
                      <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={JLPT_EXAM_CONTENT.passageTextFieldPlaceholder} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isChoukai && (
                <>
                  <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel>{JLPT_EXAM_CONTENT.audioFileFieldLabel}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {showExistingAudio && (
                              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                                <audio controls src={resolveApiMediaUrl(existingAudioUrl) ?? undefined} className="h-8 flex-1" />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => {
                                    setRemoveAudio(true)
                                    field.onChange(null)
                                  }}
                                >
                                  <TrashIcon size={14} />
                                </Button>
                              </div>
                            )}

                            {audioFile && (
                              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                                <span className="flex-1 truncate text-sm text-foreground">{audioFile.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => {
                                    field.onChange(null)
                                    if (audioInputRef.current) audioInputRef.current.value = ''
                                  }}
                                >
                                  <TrashIcon size={14} />
                                </Button>
                              </div>
                            )}

                            {!showExistingAudio && !audioFile && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => audioInputRef.current?.click()}
                              >
                                <UploadSimpleIcon size={14} />
                                <span className="ml-1.5">Chọn file âm thanh</span>
                              </Button>
                            )}

                            <input
                              ref={audioInputRef}
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                field.onChange(file)
                                if (file) setRemoveAudio(false)
                              }}
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">{JLPT_EXAM_CONTENT.audioFileFieldHint}</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audioScript"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel>{JLPT_EXAM_CONTENT.audioScriptFieldLabel}</FormLabel>
                        <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={JLPT_EXAM_CONTENT.audioScriptFieldPlaceholder} rows={4} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mondaiType"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel>{JLPT_EXAM_CONTENT.mondaiTypeFieldLabel}</FormLabel>
                        <Select
                          value={field.value ?? '__none__'}
                          onValueChange={(v) => field.onChange(v === '__none__' ? null : v)}
                        >
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder={JLPT_EXAM_CONTENT.mondaiTypeFieldPlaceholder} /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">{JLPT_EXAM_CONTENT.mondaiTypeNoneLabel}</SelectItem>
                            {(Object.keys(CHOUKAI_MONDAI_TYPE_LABELS) as ChoukaiMondaiType[]).map((key) => (
                              <SelectItem key={key} value={key}>{CHOUKAI_MONDAI_TYPE_LABELS[key]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.orderIndexFieldLabel}</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder={JLPT_EXAM_CONTENT.orderIndexFieldPlaceholder} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="shrink-0 pt-4">
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>{JLPT_EXAM_CONTENT.cancelLabel}</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? JLPT_EXAM_CONTENT.createGroupConfirmLabel : JLPT_EXAM_CONTENT.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
