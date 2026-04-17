import { zodResolver } from '@hookform/resolvers/zod'
import { GlobeHemisphereWestIcon, ImageIcon, LockSimpleIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ADMIN_DECK_CONTENT, DECK_ADMIN_STATUS_LABELS } from '@/constants/adminDeck'
import { adminDeckFormSchema, type AdminDeckFormValues } from '@/lib/validations/deckAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import { DECK_ADMIN_STATUS_OPTIONS, type AdminDeckDetailResponse, type AdminDeckTypeResponse } from '@/types/deckAdmin'

interface AdminDeckFormProps {
  title: string
  submitLabel: string
  deckTypes: AdminDeckTypeResponse[]
  initialValues?: Partial<AdminDeckDetailResponse>
  isPending?: boolean
  onCancel?: () => void
  onSubmit: (values: AdminDeckFormValues) => void | Promise<void>
}

function getDefaultValues(initialValues?: Partial<AdminDeckDetailResponse>): AdminDeckFormValues {
  return {
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    coverImageFile: null,
    visibility: initialValues?.visibility ?? 'Public',
    status: initialValues?.status ?? 'Draft',
    isOfficial: initialValues?.isOfficial ?? false,
    typeId: initialValues?.type?.id ?? '',
  }
}

export function AdminDeckForm({
  title,
  submitLabel,
  deckTypes,
  initialValues,
  isPending = false,
  onCancel,
  onSubmit,
}: AdminDeckFormProps) {
  const form = useForm<AdminDeckFormValues>({
    resolver: zodResolver(adminDeckFormSchema),
    defaultValues: getDefaultValues(initialValues),
  })

  useEffect(() => {
    form.reset(getDefaultValues(initialValues))
  }, [form, initialValues])

  const isSubmitting = form.formState.isSubmitting || isPending

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.editor.formDescription}</p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="coverImageFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ADMIN_DECK_CONTENT.editor.coverLabel}</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <ImageUpload
                      value={field.value ?? null}
                      onChange={(file) => field.onChange(file)}
                      defaultPreview={resolveApiMediaUrl(initialValues?.coverImageUrl) ?? undefined}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ImageIcon size={14} />
                      <span>{ADMIN_DECK_CONTENT.editor.coverHint}</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ADMIN_DECK_CONTENT.editor.titleLabel}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={ADMIN_DECK_CONTENT.editor.titlePlaceholder} />
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
                <FormLabel>{ADMIN_DECK_CONTENT.editor.descriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} placeholder={ADMIN_DECK_CONTENT.editor.descriptionPlaceholder} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_DECK_CONTENT.editor.typeLabel}</FormLabel>
                  <Select value={field.value || '__none__'} onValueChange={(value) => field.onChange(value === '__none__' ? '' : value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ADMIN_DECK_CONTENT.editor.typePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">{ADMIN_DECK_CONTENT.editor.typeEmptyLabel}</SelectItem>
                      {deckTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ADMIN_DECK_CONTENT.editor.statusLabel}</FormLabel>
                  <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ADMIN_DECK_CONTENT.editor.statusLabel} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DECK_ADMIN_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {DECK_ADMIN_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ADMIN_DECK_CONTENT.editor.visibilityLabel}</FormLabel>
                <FormControl>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => field.onChange('Private')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Private'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${field.value === 'Private' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <LockSimpleIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ADMIN_DECK_CONTENT.editor.privateVisibilityTitle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.privateVisibilityDescription}</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange('Public')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Public'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${field.value === 'Public' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <GlobeHemisphereWestIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ADMIN_DECK_CONTENT.editor.publicVisibilityTitle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.publicVisibilityDescription}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isOfficial"
            render={({ field }) => (
              <FormItem className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <FormLabel>{ADMIN_DECK_CONTENT.editor.officialLabel}</FormLabel>
                    <p className="text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.officialDescription}</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-wrap justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {ADMIN_DECK_CONTENT.editor.cancelLabel}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
