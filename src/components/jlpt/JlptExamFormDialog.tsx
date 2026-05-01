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
import {
  JLPT_EXAM_CONTENT,
  JLPT_LEVEL_LABELS,
} from '@/constants/jlptAdmin'
import {
  createExamSchema,
  type CreateExamFormValues,
} from '@/lib/validations/jlptAdmin'
import type { ExamDetailResponse, JlptLevel } from '@/types/jlptAdmin'

interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
}

interface CreateDialogProps extends BaseDialogProps {
  mode: 'create'
  onSubmit: (payload: { title: string; level: JlptLevel; totalDurationMinutes: number }) => Promise<void>
}

interface EditDialogProps extends BaseDialogProps {
  mode: 'edit'
  exam: ExamDetailResponse
  onSubmit: (payload: { title: string; level: JlptLevel; totalDurationMinutes: number }) => Promise<void>
}

type JlptExamFormDialogProps = CreateDialogProps | EditDialogProps

function buildCreateDefaults(): CreateExamFormValues {
  return {
    title: '',
    level: 'N5',
    totalDurationMinutes: 120,
  }
}

function buildEditDefaults(exam: ExamDetailResponse): CreateExamFormValues {
  return {
    title: exam.title,
    level: exam.level,
    totalDurationMinutes: exam.totalDurationMinutes,
  }
}

export function JlptExamFormDialog(props: JlptExamFormDialogProps) {
  const isCreateMode = props.mode === 'create'

  const form = useForm<CreateExamFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createExamSchema) as any,
    defaultValues: isCreateMode ? buildCreateDefaults() : buildEditDefaults(props.exam),
  })

  useEffect(() => {
    if (isCreateMode) {
      form.reset(buildCreateDefaults())
      return
    }
    form.reset(buildEditDefaults(props.exam))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: CreateExamFormValues) {
    await props.onSubmit({
      title: values.title.trim(),
      level: values.level,
      totalDurationMinutes: values.totalDurationMinutes,
    })

    if (isCreateMode) {
      form.reset(buildCreateDefaults())
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? JLPT_EXAM_CONTENT.createExamTitle : JLPT_EXAM_CONTENT.editExamTitle}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode ? JLPT_EXAM_CONTENT.createExamDescription : JLPT_EXAM_CONTENT.editExamDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{JLPT_EXAM_CONTENT.titleFieldLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={JLPT_EXAM_CONTENT.titleFieldPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.levelFieldLabel}</FormLabel>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value as JlptLevel)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="N5">{JLPT_LEVEL_LABELS.N5}</SelectItem>
                        <SelectItem value="N4">{JLPT_LEVEL_LABELS.N4}</SelectItem>
                        <SelectItem value="N3">{JLPT_LEVEL_LABELS.N3}</SelectItem>
                        <SelectItem value="N2">{JLPT_LEVEL_LABELS.N2}</SelectItem>
                        <SelectItem value="N1">{JLPT_LEVEL_LABELS.N1}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalDurationMinutes"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.durationFieldLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder={JLPT_EXAM_CONTENT.durationFieldPlaceholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>
                {JLPT_EXAM_CONTENT.cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? JLPT_EXAM_CONTENT.createConfirmLabel : JLPT_EXAM_CONTENT.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
