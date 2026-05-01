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
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import {
  sectionSchema,
  type SectionFormValues,
} from '@/lib/validations/jlptAdmin'
import type { ExamSectionResponse, SectionType } from '@/types/jlptAdmin'

interface CreateProps {
  mode: 'create'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  nextOrderIndex: number
  onSubmit: (payload: { sectionType: SectionType; orderIndex: number; durationMinutes: number; maxScore: number; passScore: number }) => Promise<void>
}

interface EditProps {
  mode: 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  section: ExamSectionResponse
  onSubmit: (payload: { sectionType: SectionType; orderIndex: number; durationMinutes: number; maxScore: number; passScore: number }) => Promise<void>
}

type JlptSectionFormDialogProps = CreateProps | EditProps

function buildCreateDefaults(orderIndex: number): SectionFormValues {
  return { sectionType: 'Moji', orderIndex, durationMinutes: 25, maxScore: 60, passScore: 19 }
}

function buildEditDefaults(section: ExamSectionResponse): SectionFormValues {
  return {
    sectionType: section.sectionType,
    orderIndex: section.orderIndex,
    durationMinutes: section.durationMinutes,
    maxScore: section.maxScore,
    passScore: section.passScore,
  }
}

export function JlptSectionFormDialog(props: JlptSectionFormDialogProps) {
  const isCreateMode = props.mode === 'create'

  const form = useForm<SectionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: isCreateMode ? buildCreateDefaults(props.nextOrderIndex) : buildEditDefaults(props.section),
  })

  useEffect(() => {
    if (isCreateMode) {
      form.reset(buildCreateDefaults(props.nextOrderIndex))
      return
    }
    form.reset(buildEditDefaults(props.section))
  }, [form, isCreateMode, props])

  const isSubmitting = props.isPending || form.formState.isSubmitting

  async function handleSubmit(values: SectionFormValues) {
    await props.onSubmit({
      sectionType: values.sectionType,
      orderIndex: values.orderIndex,
      durationMinutes: values.durationMinutes,
      maxScore: values.maxScore,
      passScore: values.passScore,
    })
    if (isCreateMode) form.reset(buildCreateDefaults(props.nextOrderIndex))
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? JLPT_EXAM_CONTENT.createSectionTitle : JLPT_EXAM_CONTENT.editSectionTitle}</DialogTitle>
          <DialogDescription>{isCreateMode ? JLPT_EXAM_CONTENT.createSectionDescription : JLPT_EXAM_CONTENT.editSectionDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sectionType"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.sectionTypeFieldLabel}</FormLabel>
                    <Select value={field.value} onValueChange={(v) => field.onChange(v as SectionType)}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder={JLPT_EXAM_CONTENT.sectionTypeFieldPlaceholder} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Moji">{SECTION_TYPE_LABELS.Moji}</SelectItem>
                        <SelectItem value="Bunpou">{SECTION_TYPE_LABELS.Bunpou}</SelectItem>
                        <SelectItem value="Dokkai">{SECTION_TYPE_LABELS.Dokkai}</SelectItem>
                        <SelectItem value="Choukai">{SECTION_TYPE_LABELS.Choukai}</SelectItem>
                      </SelectContent>
                    </Select>
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
              name="durationMinutes"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{JLPT_EXAM_CONTENT.durationMinutesFieldLabel}</FormLabel>
                  <FormControl><Input type="number" {...field} placeholder={JLPT_EXAM_CONTENT.durationMinutesFieldPlaceholder} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.maxScoreFieldLabel}</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder={JLPT_EXAM_CONTENT.maxScoreFieldPlaceholder} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passScore"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_EXAM_CONTENT.passScoreFieldLabel}</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder={JLPT_EXAM_CONTENT.passScoreFieldPlaceholder} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => props.onOpenChange(false)}>{JLPT_EXAM_CONTENT.cancelLabel}</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {isCreateMode ? JLPT_EXAM_CONTENT.createSectionConfirmLabel : JLPT_EXAM_CONTENT.saveLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
