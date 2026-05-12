import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
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
  JLPT_AI_QUESTION_CONTENT,
  JLPT_LEVEL_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import {
  aiGenerateSchema,
  type AiGenerateFormValues,
} from '@/lib/validations/jlptAdmin'
import type { JlptLevel, SectionType } from '@/types/jlptAdmin'

interface JlptAiGenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  onSubmit: (values: AiGenerateFormValues) => Promise<void>
  defaultLevel?: JlptLevel
  defaultSectionType?: SectionType
  lockLevelAndSection?: boolean
}

export function JlptAiGenerateDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
  defaultLevel,
  defaultSectionType,
  lockLevelAndSection = false,
}: JlptAiGenerateDialogProps) {
  const form = useForm<AiGenerateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiGenerateSchema) as any,
    defaultValues: {
      level: defaultLevel ?? 'N5',
      sectionType: defaultSectionType ?? 'Moji',
      topic: '',
      count: 5,
      questionGroupId: '',
    },
  })

  const isSubmitting = isPending || form.formState.isSubmitting

  async function handleSubmit(values: AiGenerateFormValues) {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{JLPT_AI_QUESTION_CONTENT.generateTitle}</DialogTitle>
          <DialogDescription>{JLPT_AI_QUESTION_CONTENT.generateDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{JLPT_AI_QUESTION_CONTENT.topicFieldLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={JLPT_AI_QUESTION_CONTENT.topicFieldPlaceholder} />
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
                    <FormLabel>{JLPT_AI_QUESTION_CONTENT.levelFieldLabel}</FormLabel>
                    <Select value={field.value} onValueChange={(v) => field.onChange(v as JlptLevel)} disabled={lockLevelAndSection}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                name="sectionType"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel>{JLPT_AI_QUESTION_CONTENT.sectionTypeFieldLabel}</FormLabel>
                    <Select value={field.value} onValueChange={(v) => field.onChange(v as SectionType)} disabled={lockLevelAndSection}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
            </div>

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel>{JLPT_AI_QUESTION_CONTENT.countFieldLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder={JLPT_AI_QUESTION_CONTENT.countFieldPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {JLPT_AI_QUESTION_CONTENT.cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                {JLPT_AI_QUESTION_CONTENT.generateConfirmLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
