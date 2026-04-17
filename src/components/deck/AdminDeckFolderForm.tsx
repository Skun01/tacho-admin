import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { adminDeckFolderFormSchema, type AdminDeckFolderFormValues } from '@/lib/validations/deckAdmin'
import type { DeckFolderResponse } from '@/types/deckAdmin'

interface AdminDeckFolderFormProps {
  title: string
  initialValues?: Partial<DeckFolderResponse>
  isPending?: boolean
  onCancel: () => void
  onSubmit: (values: AdminDeckFolderFormValues) => void
}

function getDefaultValues(initialValues?: Partial<DeckFolderResponse>): AdminDeckFolderFormValues {
  return {
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
  }
}

export function AdminDeckFolderForm({
  title,
  initialValues,
  isPending = false,
  onCancel,
  onSubmit,
}: AdminDeckFolderFormProps) {
  const form = useForm<AdminDeckFolderFormValues>({
    resolver: zodResolver(adminDeckFolderFormSchema),
    defaultValues: getDefaultValues(initialValues),
  })

  useEffect(() => {
    form.reset(getDefaultValues(initialValues))
  }, [form, initialValues])

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.folderForm.helperDescription}</p>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ADMIN_DECK_CONTENT.folderForm.titleLabel}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={ADMIN_DECK_CONTENT.folderForm.titlePlaceholder} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ADMIN_DECK_CONTENT.folderForm.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder={ADMIN_DECK_CONTENT.folderForm.descriptionPlaceholder} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {ADMIN_DECK_CONTENT.folderForm.cancelLabel}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
            {ADMIN_DECK_CONTENT.folderForm.submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
