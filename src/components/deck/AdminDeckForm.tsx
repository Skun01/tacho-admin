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
import { Textarea } from '@/components/ui/textarea'
import {
  ADMIN_DECK_CONTENT,
  DECK_ADMIN_STATUS_DESCRIPTIONS,
  DECK_ADMIN_STATUS_LABELS,
} from '@/constants/adminDeck'
import { adminDeckFormSchema, type AdminDeckFormValues } from '@/lib/validations/deckAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import { DECK_ADMIN_STATUS_OPTIONS, type AdminDeckDetailResponse, type AdminDeckTypeResponse } from '@/types/deckAdmin'

interface AdminDeckFormProps {
  title: string
  submitLabel: string
  deckTypes: AdminDeckTypeResponse[]
  initialValues?: Partial<AdminDeckDetailResponse>
  isPending?: boolean
  variant?: 'panel' | 'modal'
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
  variant = 'panel',
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
  const isModal = variant === 'modal'

  return (
    <div className={isModal ? 'flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden p-0' : 'rounded-2xl border bg-card p-6 shadow-sm'}>
      <div className={isModal ? 'shrink-0 border-b border-[#1d1c13]/8 px-6 py-4' : 'mb-6 space-y-1'}>
        <h2 className={isModal ? 'text-base font-bold text-foreground' : 'text-xl font-semibold'}>{title}</h2>
        {!isModal && (
          <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.editor.formDescription}</p>
        )}
      </div>

      <Form {...form}>
        <form
          className={isModal ? 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5' : 'space-y-5'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="coverImageFile"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                {!isModal && <FormLabel>{ADMIN_DECK_CONTENT.editor.coverLabel}</FormLabel>}
                <FormControl>
                  <div className={isModal ? '' : 'space-y-3'}>
                    <ImageUpload
                      value={field.value ?? null}
                      onChange={(file) => field.onChange(file)}
                      defaultPreview={resolveApiMediaUrl(initialValues?.coverImageUrl) ?? undefined}
                      className={isModal ? '[&_label]:h-28 [&_.aspect-video]:aspect-[2.35/1]' : undefined}
                    />
                    {!isModal && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon size={14} />
                        <span>{ADMIN_DECK_CONTENT.editor.coverHint}</span>
                      </div>
                    )}
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
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.titleLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={ADMIN_DECK_CONTENT.editor.titlePlaceholder}
                    className={isModal ? 'h-10 rounded-xl border-0 bg-surface-container-low px-4 shadow-none focus-visible:bg-surface-container focus-visible:ring-0' : 'h-11 rounded-2xl bg-background'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.descriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={isModal ? 3 : 4}
                    placeholder={ADMIN_DECK_CONTENT.editor.descriptionPlaceholder}
                    className={isModal ? 'min-h-0 resize-none rounded-xl border-0 bg-surface-container-low px-4 py-2.5 shadow-none focus-visible:bg-surface-container focus-visible:ring-0' : 'rounded-2xl bg-background'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={isModal ? 'space-y-5' : 'grid gap-5 lg:grid-cols-2'}>
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.typeLabel}</FormLabel>
                  <Select value={field.value || '__none__'} onValueChange={(value) => field.onChange(value === '__none__' ? '' : value)}>
                    <FormControl>
                      <SelectTrigger className={isModal ? 'h-10 rounded-xl border-0 bg-surface-container-low shadow-none focus:ring-0' : undefined}>
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
          </div>

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.visibilityLabel}</FormLabel>
                <FormControl>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => field.onChange('Private')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Private'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : isModal
                            ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                            : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full ${isModal ? 'p-1.5' : 'p-2'} ${field.value === 'Private' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <LockSimpleIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ADMIN_DECK_CONTENT.editor.privateVisibilityTitle}</p>
                          {!isModal && (
                            <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.privateVisibilityDescription}</p>
                          )}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange('Public')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Public'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : isModal
                            ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                            : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full ${isModal ? 'p-1.5' : 'p-2'} ${field.value === 'Public' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          <GlobeHemisphereWestIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{ADMIN_DECK_CONTENT.editor.publicVisibilityTitle}</p>
                          {!isModal && (
                            <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.publicVisibilityDescription}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.statusLabel}</FormLabel>
                  {!isModal && (
                    <p className="text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.statusDescription}</p>
                  )}
                  <FormControl>
                    <div className="grid gap-1.5 sm:grid-cols-3">
                      {DECK_ADMIN_STATUS_OPTIONS.map((status) => {
                        const selected = field.value === status
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => field.onChange(status)}
                            className={`min-h-8 rounded-md border px-2.5 py-1.5 text-left transition-all ${
                              selected
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                                : isModal
                                  ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                                  : 'border-border bg-background hover:border-primary/30'
                            }`}
                          >
                            <div>
                              <p className={`${isModal ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>
                                {DECK_ADMIN_STATUS_LABELS[status]}
                              </p>
                              {!isModal && (
                                <p className="mt-1 text-xs text-muted-foreground">{DECK_ADMIN_STATUS_DESCRIPTIONS[status]}</p>
                              )}
                            </div>
                          </button>
                        )
                      })}
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
                <FormItem className="gap-1.5">
                  <FormLabel className="text-xs font-semibold">{ADMIN_DECK_CONTENT.editor.officialLabel}</FormLabel>
                  <FormControl>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => field.onChange(false)}
                        className={`min-h-8 rounded-md border px-2.5 py-1.5 text-left transition-all ${
                          !field.value
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                            : isModal
                              ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                              : 'border-border bg-background hover:border-primary/30'
                        }`}
                      >
                        <p className={`${isModal ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>
                          {ADMIN_DECK_CONTENT.editor.officialNoTitle}
                        </p>
                        {!isModal && (
                          <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.officialNoDescription}</p>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange(true)}
                        className={`min-h-8 rounded-md border px-2.5 py-1.5 text-left transition-all ${
                          field.value
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                            : isModal
                              ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                              : 'border-border bg-background hover:border-primary/30'
                        }`}
                      >
                        <p className={`${isModal ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>
                          {ADMIN_DECK_CONTENT.editor.officialYesTitle}
                        </p>
                        {!isModal && (
                          <p className="mt-1 text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.editor.officialYesDescription}</p>
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={isModal ? 'flex gap-3 pt-1' : 'flex flex-wrap justify-end gap-3'}>
            {onCancel && (
              <Button
                type="button"
                variant={isModal ? 'secondary' : 'outline'}
                onClick={onCancel}
                disabled={isSubmitting}
                className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
              >
                {ADMIN_DECK_CONTENT.editor.cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
            >
              {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
