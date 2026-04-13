import { useEffect, useState, useCallback, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ui/image-upload'
import { KanjiRadicalsSection } from '@/components/kanji/KanjiRadicalsSection'
import { ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import { kanjiUpsertSchema, type KanjiUpsertInput } from '@/lib/validations/kanjiAdmin'
import { KANJI_LEVEL_OPTIONS, KANJI_STATUS_LABELS, KANJI_STATUS_OPTIONS, type KanjiAdminDetail, type KanjiUpsertPayload } from '@/types/kanjiAdmin'

interface KanjiUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData: KanjiAdminDetail | null
  isSubmitting: boolean
  isLoadingDetail: boolean
  onSubmit: (payload: KanjiUpsertPayload) => void
}

const EMPTY_DEFAULTS: KanjiUpsertInput = {
  title: '',
  summary: '',
  level: null,
  status: null,
  tags: [],
  kanji: '',
  strokeCount: 1,
  strokeOrderUrl: null,
  onyomi: [],
  kunyomi: [],
  hanViet: null,
  meaningVi: '',
  radicals: [{ character: '', meaningVi: '' }],
}

function mapDetailToForm(detail: KanjiAdminDetail): KanjiUpsertInput {
  return {
    title: detail.title,
    summary: detail.summary,
    level: detail.level,
    status: detail.status,
    tags: detail.tags,
    kanji: detail.kanji,
    strokeCount: detail.strokeCount,
    strokeOrderUrl: detail.strokeOrderUrl,
    onyomi: detail.onyomi ?? [],
    kunyomi: detail.kunyomi ?? [],
    hanViet: detail.hanViet,
    meaningVi: detail.meaningVi,
    radicals: detail.radicals.map((r) => ({ character: r.character, meaningVi: r.meaningVi })),
  }
}

export function KanjiUpsertForm({
  open,
  onOpenChange,
  mode,
  initialData,
  isSubmitting,
  isLoadingDetail,
  onSubmit,
}: KanjiUpsertFormProps) {
  const C = ADMIN_KANJI_CONTENT.form
  const [tagInput, setTagInput] = useState('')
  const [onyomiInput, setOnyomiInput] = useState('')
  const [kunyomiInput, setKunyomiInput] = useState('')
  const [strokeOrderFile, setStrokeOrderFile] = useState<File | null>(null)

  const form = useForm<KanjiUpsertInput>({
    resolver: zodResolver(kanjiUpsertSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  // Populate form with detail data in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset(mapDetailToForm(initialData))
      return
    }

    form.reset(EMPTY_DEFAULTS)
    setStrokeOrderFile(null)
    setTagInput('')
    setOnyomiInput('')
    setKunyomiInput('')
  }, [mode, initialData, form, open])

  const handleFormSubmit = form.handleSubmit((data) => {
    const payload: KanjiUpsertPayload = {
      title: data.title,
      summary: data.summary,
      level: data.level,
      tags: data.tags,
      status: data.status,
      kanji: data.kanji,
      strokeCount: data.strokeCount,
      strokeOrderUrl: data.strokeOrderUrl,
      onyomi: data.onyomi,
      kunyomi: data.kunyomi,
      hanViet: data.hanViet || null,
      meaningVi: data.meaningVi,
      radicals: data.radicals,
    }
    onSubmit(payload)
  })

  // Multi-value input handler factory
  const createMultiValueHandler = useCallback(
    (fieldName: 'tags' | 'onyomi' | 'kunyomi', inputValue: string, setInputValue: (v: string) => void) =>
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        const trimmed = inputValue.trim()
        if (!trimmed) return

        const currentValues = form.getValues(fieldName)
        if (!currentValues.includes(trimmed)) {
          form.setValue(fieldName, [...currentValues, trimmed], { shouldDirty: true })
        }
        setInputValue('')
      },
    [form],
  )

  const removeMultiValue = useCallback(
    (fieldName: 'tags' | 'onyomi' | 'kunyomi', index: number) => {
      const currentValues = form.getValues(fieldName)
      form.setValue(
        fieldName,
        currentValues.filter((_, i) => i !== index),
        { shouldDirty: true },
      )
    },
    [form],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? C.dialogTitleCreate : C.dialogTitleEdit}</DialogTitle>
          <DialogDescription>{C.dialogDescription}</DialogDescription>
        </DialogHeader>

        {isLoadingDetail && mode === 'edit' ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Section: Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">{C.sections.basicTitle}</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Kanji character */}
                  <FormField
                    control={form.control}
                    name="kanji"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{C.fields.kanjiLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={C.fields.kanjiPlaceholder} className="text-center text-2xl font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stroke count */}
                  <FormField
                    control={form.control}
                    name="strokeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{C.fields.strokeCountLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder={C.fields.strokeCountPlaceholder}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.titleLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={C.fields.titlePlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Summary */}
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.summaryLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={C.fields.summaryPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MeaningVi */}
                <FormField
                  control={form.control}
                  name="meaningVi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.meaningViLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={C.fields.meaningViPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* HanViet */}
                <FormField
                  control={form.control}
                  name="hanViet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.hanVietLabel}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          placeholder={C.fields.hanVietPlaceholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.levelLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {KANJI_LEVEL_OPTIONS.map((level) => (
                          <Button
                            key={level}
                            type="button"
                            size="sm"
                            variant={field.value === level ? 'default' : 'outline'}
                            onClick={() => field.onChange(field.value === level ? null : level)}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{C.fields.statusLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {KANJI_STATUS_OPTIONS.map((status) => (
                          <Button
                            key={status}
                            type="button"
                            size="sm"
                            variant={field.value === status ? 'default' : 'outline'}
                            onClick={() => field.onChange(status)}
                          >
                            {KANJI_STATUS_LABELS[status]}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Onyomi multi-value */}
                <FormField
                  control={form.control}
                  name="onyomi"
                  render={() => (
                    <FormItem>
                      <FormLabel>{C.fields.onyomiLabel}</FormLabel>
                      <FormControl>
                        <Input
                          value={onyomiInput}
                          onChange={(e) => setOnyomiInput(e.target.value)}
                          onKeyDown={createMultiValueHandler('onyomi', onyomiInput, setOnyomiInput)}
                          placeholder={C.fields.onyomiPlaceholder}
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {form.watch('onyomi').map((item, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {item}
                            <button type="button" onClick={() => removeMultiValue('onyomi', i)} className="ml-0.5 hover:text-destructive">
                              <XIcon size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kunyomi multi-value */}
                <FormField
                  control={form.control}
                  name="kunyomi"
                  render={() => (
                    <FormItem>
                      <FormLabel>{C.fields.kunyomiLabel}</FormLabel>
                      <FormControl>
                        <Input
                          value={kunyomiInput}
                          onChange={(e) => setKunyomiInput(e.target.value)}
                          onKeyDown={createMultiValueHandler('kunyomi', kunyomiInput, setKunyomiInput)}
                          placeholder={C.fields.kunyomiPlaceholder}
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {form.watch('kunyomi').map((item, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {item}
                            <button type="button" onClick={() => removeMultiValue('kunyomi', i)} className="ml-0.5 hover:text-destructive">
                              <XIcon size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags multi-value */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>{C.fields.tagsLabel}</FormLabel>
                      <FormControl>
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={createMultiValueHandler('tags', tagInput, setTagInput)}
                          placeholder={C.fields.tagsPlaceholder}
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {form.watch('tags').map((tag, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {tag}
                            <button type="button" onClick={() => removeMultiValue('tags', i)} className="ml-0.5 hover:text-destructive">
                              <XIcon size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Stroke Order Image */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">{C.sections.strokeOrderTitle}</h3>
                <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  {C.fields.strokeOrderUrlHint}
                </p>
                <ImageUpload
                  value={strokeOrderFile}
                  onChange={(file) => {
                    setStrokeOrderFile(file)
                    if (file) {
                      const tempUrl = URL.createObjectURL(file)
                      form.setValue('strokeOrderUrl', tempUrl, { shouldDirty: true })
                    } else {
                      form.setValue('strokeOrderUrl', null, { shouldDirty: true })
                    }
                  }}
                  onRemove={() => {
                    setStrokeOrderFile(null)
                    form.setValue('strokeOrderUrl', null, { shouldDirty: true })
                  }}
                  defaultPreview={initialData?.strokeOrderUrl}
                />
              </div>

              {/* Section: Radicals */}
              <KanjiRadicalsSection form={form} />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
                  {mode === 'create' ? C.createActionLabel : C.updateActionLabel}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  {C.cancelActionLabel}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
