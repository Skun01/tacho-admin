import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, SpinnerGapIcon, TrashIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { type Control, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { JLPT_EXAM_CONTENT, OPTION_LABEL_LABELS } from '@/constants/jlptAdmin'
import { questionSchema, type QuestionFormValues } from '@/lib/validations/jlptAdmin'
import type { OptionLabel, QuestionGroupQuestionResponse } from '@/types/jlptAdmin'

const OPTION_LABELS: OptionLabel[] = ['A', 'B', 'C', 'D']

interface CreateProps {
  mode: 'create'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  nextOrderIndex: number
  onSubmit: (values: QuestionFormValues) => Promise<void>
}

interface EditProps {
  mode: 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  question: QuestionGroupQuestionResponse
  onSubmit: (values: QuestionFormValues) => Promise<void>
}

type JlptQuestionFormDialogProps = CreateProps | EditProps

function buildCreateDefaults(orderIndex: number): QuestionFormValues {
  return {
    questionText: '',
    imageUrl: null,
    imageCaption: null,
    explanation: '',
    score: 1,
    orderIndex,
    options: [
      { label: 'A', text: '', imageUrl: null, optionType: 'Text', isCorrect: true },
      { label: 'B', text: '', imageUrl: null, optionType: 'Text', isCorrect: false },
    ],
  }
}

function buildEditDefaults(q: QuestionGroupQuestionResponse): QuestionFormValues {
  return {
    questionText: q.questionText,
    imageUrl: q.imageUrl,
    imageCaption: q.imageCaption,
    explanation: q.explanation ?? '',
    score: q.score,
    orderIndex: q.orderIndex,
    options: q.options.map((o) => ({
      id: o.id,
      label: o.label,
      text: o.text,
      imageUrl: o.imageUrl,
      optionType: o.optionType,
      isCorrect: o.isCorrect,
    })),
  }
}

function OptionCheckbox({ control, index, onSetCorrect }: { control: Control<QuestionFormValues>; index: number; onSetCorrect: (i: number) => void }) {
  const isCorrect = useWatch({ control, name: `options.${index}.isCorrect` })
  return (
    <Checkbox
      checked={isCorrect}
      onCheckedChange={() => onSetCorrect(index)}
      aria-label={JLPT_EXAM_CONTENT.correctOptionLabel}
    />
  )
}

export function JlptQuestionFormDialog(props: JlptQuestionFormDialogProps) {
  const isCreateMode = props.mode === 'create'

  const form = useForm<QuestionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionSchema) as any,
    defaultValues: isCreateMode ? buildCreateDefaults(props.nextOrderIndex) : buildEditDefaults(props.question),
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'options' })

  useEffect(() => {
    if (isCreateMode) {
      form.reset(buildCreateDefaults(props.nextOrderIndex))
      return
    }
    form.reset(buildEditDefaults(props.question))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: QuestionFormValues) {
    await props.onSubmit(values)
    if (isCreateMode) form.reset(buildCreateDefaults(props.nextOrderIndex))
  }

  function handleAddOption() {
    if (fields.length >= 4) return
    const nextLabel = OPTION_LABELS[fields.length]
    append({ label: nextLabel, text: '', imageUrl: null, optionType: 'Text', isCorrect: false })
  }

  function handleSetCorrect(index: number) {
    fields.forEach((_, i) => {
      form.setValue(`options.${i}.isCorrect`, i === index)
    })
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{isCreateMode ? JLPT_EXAM_CONTENT.createQuestionTitle : JLPT_EXAM_CONTENT.editQuestionTitle}</DialogTitle>
          <DialogDescription>{isCreateMode ? JLPT_EXAM_CONTENT.createQuestionDescription : JLPT_EXAM_CONTENT.editQuestionDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              <FormField
                control={form.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.questionTextFieldLabel}</FormLabel>
                    <FormControl><Textarea {...field} placeholder={JLPT_EXAM_CONTENT.questionTextFieldPlaceholder} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel>{JLPT_EXAM_CONTENT.scoreFieldLabel}</FormLabel>
                      <FormControl><Input type="number" {...field} placeholder={JLPT_EXAM_CONTENT.scoreFieldPlaceholder} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.explanationFieldLabel}</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} placeholder={JLPT_EXAM_CONTENT.explanationFieldPlaceholder} rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{JLPT_EXAM_CONTENT.optionsHeading}</h4>
                  {fields.length < 4 && (
                    <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                      <PlusIcon size={14} />
                      {JLPT_EXAM_CONTENT.addOptionLabel}
                    </Button>
                  )}
                </div>
                <FormField control={form.control} name="options" render={() => <FormMessage />} />
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex flex-col items-center gap-2 pt-6">
                      <span className="text-sm font-semibold">{OPTION_LABEL_LABELS[field.label as OptionLabel] ?? field.label}</span>
                      <OptionCheckbox control={form.control} index={index} onSetCorrect={handleSetCorrect} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <FormField
                        control={form.control}
                        name={`options.${index}.text`}
                        render={({ field: optField }) => (
                          <FormItem className="gap-1">
                            <FormLabel className="text-xs">{JLPT_EXAM_CONTENT.optionTextFieldLabel}</FormLabel>
                            <FormControl><Input {...optField} placeholder={JLPT_EXAM_CONTENT.optionTextFieldPlaceholder} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" className="mt-6 h-8 w-8 shrink-0" onClick={() => remove(index)}>
                        <TrashIcon size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="shrink-0 pt-4">
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>{JLPT_EXAM_CONTENT.cancelLabel}</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? JLPT_EXAM_CONTENT.createQuestionConfirmLabel : JLPT_EXAM_CONTENT.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
