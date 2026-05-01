import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  questionGroupSchema,
  type QuestionGroupFormValues,
} from '@/lib/validations/jlptAdmin'
import type { ChoukaiMondaiType, QuestionGroupResponse } from '@/types/jlptAdmin'

interface CreateProps {
  mode: 'create'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  nextOrderIndex: number
  onSubmit: (payload: {
    instruction: string
    passageText?: string | null
    audioScript?: string | null
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
  onSubmit: (payload: {
    instruction: string
    passageText?: string | null
    audioScript?: string | null
    orderIndex: number
    mondaiType?: ChoukaiMondaiType | null
  }) => Promise<void>
}

type JlptGroupFormDialogProps = CreateProps | EditProps

function buildCreateDefaults(orderIndex: number): QuestionGroupFormValues {
  return { instruction: '', passageText: '', audioScript: '', orderIndex, mondaiType: null }
}

function buildEditDefaults(group: QuestionGroupResponse): QuestionGroupFormValues {
  return {
    instruction: group.instruction,
    passageText: group.passageText ?? '',
    audioScript: group.audioScript ?? '',
    orderIndex: group.orderIndex,
    mondaiType: group.mondaiType,
  }
}

export function JlptQuestionGroupFormDialog(props: JlptGroupFormDialogProps) {
  const isCreateMode = props.mode === 'create'

  const form = useForm<QuestionGroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionGroupSchema) as any,
    defaultValues: isCreateMode ? buildCreateDefaults(props.nextOrderIndex) : buildEditDefaults(props.group),
  })

  useEffect(() => {
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
      passageText: values.passageText?.trim() || null,
      audioScript: values.audioScript?.trim() || null,
      orderIndex: values.orderIndex,
      mondaiType: values.mondaiType ?? null,
    })
    if (isCreateMode) form.reset(buildCreateDefaults(props.nextOrderIndex))
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isCreateMode ? JLPT_EXAM_CONTENT.createGroupTitle : JLPT_EXAM_CONTENT.editGroupTitle}</DialogTitle>
          <DialogDescription>{isCreateMode ? JLPT_EXAM_CONTENT.createGroupDescription : JLPT_EXAM_CONTENT.editGroupDescription}</DialogDescription>
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
                    <FormControl><Textarea {...field} placeholder={JLPT_EXAM_CONTENT.instructionFieldPlaceholder} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passageText"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.passageTextFieldLabel}</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={JLPT_EXAM_CONTENT.passageTextFieldPlaceholder} rows={4} /></FormControl>
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
                    <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={JLPT_EXAM_CONTENT.audioScriptFieldPlaceholder} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
