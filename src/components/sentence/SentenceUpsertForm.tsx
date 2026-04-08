import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SpeakerHighIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { sentenceUpsertSchema, type SentenceUpsertInput } from '@/lib/validations/sentenceAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import { voicevoxService } from '@/services/voicevoxService'
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
  const [speakerId, setSpeakerId] = useState<number | null>(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const resolvedPreviewAudioUrl = resolveApiMediaUrl(previewAudioUrl)

  const { data: speakerResponse, isLoading: isLoadingSpeakers } = useQuery({
    queryKey: ['admin', 'voicevox', 'speakers'],
    queryFn: async () => {
      const { data } = await voicevoxService.getSpeakers()
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const speakers = speakerResponse ?? []

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        text: initialData.text,
        meaning: initialData.meaning,
        level: (initialData.level ?? undefined) as SentenceUpsertInput['level'],
      })
      setSpeakerId(initialData.speakerId ?? null)
      setPreviewAudioUrl(initialData.audioUrl ?? null)
      return
    }

    form.reset(DEFAULT_VALUES)
    setSpeakerId(null)
    setPreviewAudioUrl(null)
  }, [mode, initialData, form, open])

  const handlePreviewAudio = async () => {
    if (!speakerId) {
      gooeyToast.warning(ADMIN_SENTENCE_CONTENT.form.speakerRequiredLabel)
      return
    }

    try {
      setIsPreviewing(true)
      const text = form.getValues('text').trim()
      const { data } = await voicevoxService.preview({
        speakerId,
        text: text || undefined,
      })
      setPreviewAudioUrl(data.data.audioUrl)
      gooeyToast.success(ADMIN_SENTENCE_CONTENT.form.previewAudioSuccessLabel)
    } catch {
      gooeyToast.error(ADMIN_SENTENCE_CONTENT.form.previewAudioFailedLabel)
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleSubmit = (values: SentenceUpsertInput) => {
    if (!speakerId) {
      gooeyToast.warning(ADMIN_SENTENCE_CONTENT.form.speakerRequiredLabel)
      return
    }

    onSubmit({
      text: values.text.trim(),
      meaning: values.meaning.trim(),
      speakerId,
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

            <FormItem>
              <FormLabel>{ADMIN_SENTENCE_CONTENT.form.fields.speakerLabel}</FormLabel>
              <FormControl>
                <select
                  value={speakerId ?? ''}
                  onChange={(event) => setSpeakerId(event.target.value ? Number(event.target.value) : null)}
                  disabled={isSubmitting || isLoadingSpeakers}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">{ADMIN_SENTENCE_CONTENT.form.fields.speakerPlaceholder}</option>
                  {speakers.map((speaker) => (
                    <option key={speaker.speakerId} value={speaker.speakerId}>
                      {speaker.characterName} - {speaker.styleName}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handlePreviewAudio} disabled={isSubmitting || isPreviewing || !speakerId}>
                <SpeakerHighIcon size={16} />
                {ADMIN_SENTENCE_CONTENT.form.generatePreviewLabel}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">{ADMIN_SENTENCE_CONTENT.form.audioPreviewLabel}</p>
              {resolvedPreviewAudioUrl ? (
                <audio controls src={resolvedPreviewAudioUrl} className="w-full" />
              ) : (
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {ADMIN_SENTENCE_CONTENT.form.audioEmptyLabel}
                </p>
              )}
            </div>

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
