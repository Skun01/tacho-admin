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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { deckTypeFormSchema, type DeckTypeFormValues } from '@/lib/validations/deckAdmin'

interface AdminDeckTypeFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  initialName?: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: DeckTypeFormValues) => void
}

export function AdminDeckTypeFormDialog({
  open,
  mode,
  initialName = '',
  isPending = false,
  onOpenChange,
  onSubmit,
}: AdminDeckTypeFormDialogProps) {
  const form = useForm<DeckTypeFormValues>({
    resolver: zodResolver(deckTypeFormSchema),
    defaultValues: { name: initialName },
  })

  useEffect(() => {
    form.reset({ name: initialName })
  }, [form, initialName, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? ADMIN_DECK_CONTENT.deckTypePage.dialogCreateTitle
              : ADMIN_DECK_CONTENT.deckTypePage.dialogEditTitle}
          </DialogTitle>
          <DialogDescription>{ADMIN_DECK_CONTENT.deckTypePage.dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_DECK_CONTENT.deckTypePage.inputLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={ADMIN_DECK_CONTENT.deckTypePage.inputPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                {ADMIN_DECK_CONTENT.deckTypePage.cancelLabel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
                {mode === 'create'
                  ? ADMIN_DECK_CONTENT.deckTypePage.submitCreateLabel
                  : ADMIN_DECK_CONTENT.deckTypePage.submitEditLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
