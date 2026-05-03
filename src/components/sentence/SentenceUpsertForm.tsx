import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { sentenceUpsertSchema, type SentenceUpsertInput } from '@/lib/validations/sentenceAdmin'
import { SENTENCE_LEVEL_OPTIONS, type SentenceAdminItem, type SentenceUpsertPayload } from '@/types/sentenceAdmin'
import { ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'

interface SentenceUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: SentenceAdminItem | null
  isSubmitting: boolean
  onSubmit: (payload: SentenceUpsertPayload) => void
}

const DEFAULT_VALUES: SentenceUpsertInput = {
  text: '',
  meaning: '',
  level: undefined,
}

export function SentenceUpsertForm({
  open,
  onOpenChange,
  mode,
  initialData,
  isSubmitting,
  onSubmit,
}: SentenceUpsertFormProps) {
  const form = useForm<SentenceUpsertInput>({
    resolver: zodResolver(sentenceUpsertSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        text: initialData.text,
        meaning: initialData.meaning,
        level: (initialData.level ?? undefined) as SentenceUpsertInput['level'],
      })
      return
    }

    form.reset(DEFAULT_VALUES)
  }, [mode, initialData, form, open])

  const handleSubmit = (values: SentenceUpsertInput) => {
    onSubmit({
      text: values.text.trim(),
      meaning: values.meaning.trim(),
      level: values.level ?? null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? ADMIN_SENTENCE_CONTENT.form.dialogTitleCreate : ADMIN_SENTENCE_CONTENT.form.dialogTitleEdit}</DialogTitle>
          <DialogDescription>{ADMIN_SENTENCE_CONTENT.form.dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_SENTENCE_CONTENT.form.fields.textLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={ADMIN_SENTENCE_CONTENT.form.fields.textPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_SENTENCE_CONTENT.form.fields.meaningLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={ADMIN_SENTENCE_CONTENT.form.fields.meaningPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_SENTENCE_CONTENT.form.fields.levelLabel}</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {SENTENCE_LEVEL_OPTIONS.map((level) => (
                      <Button
                        key={level}
                        type="button"
                        size="sm"
                        variant={field.value === level ? 'default' : 'outline'}
                        onClick={() => field.onChange(field.value === level ? undefined : level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {mode === 'create' ? ADMIN_SENTENCE_CONTENT.form.createActionLabel : ADMIN_SENTENCE_CONTENT.form.updateActionLabel}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {ADMIN_SENTENCE_CONTENT.form.cancelActionLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}