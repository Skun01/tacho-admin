import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { Control } from 'react-hook-form'
import 'react-h5-audio-player/lib/styles.css'

interface VocabularyReadingAudioPanelProps {
  control: Control<VocabularyUpsertInput>
  audioUrl: string | null
}

export function VocabularyReadingAudioPanel({
  control,
  audioUrl,
}: VocabularyReadingAudioPanelProps) {
  const resolvedAudioUrl = resolveApiMediaUrl(audioUrl)

  return (
    <FormField
      control={control}
      name="reading"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="inline-flex h-5 items-center leading-5">
            {ADMIN_VOCABULARY_CONTENT.form.fields.readingLabel}
          </FormLabel>
          <FormControl>
            <Input
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value)}
              placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.readingPlaceholder}
            />
          </FormControl>
          <FormMessage />

          <div
            className="mt-3 overflow-hidden rounded-md border p-1.5"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'color-mix(in srgb, var(--surface) 92%, var(--primary) 2%)',
            }}
          >
            <p className="text-xs font-medium">{ADMIN_VOCABULARY_CONTENT.form.audioPreviewLabel}</p>

            <div className="mt-1">
              {resolvedAudioUrl ? (
                <AudioPlayer
                  src={resolvedAudioUrl}
                  preload="metadata"
                  showJumpControls={false}
                  autoPlayAfterSrcChange={false}
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  customProgressBarSection={[RHAP_UI.CURRENT_TIME, RHAP_UI.PROGRESS_BAR, RHAP_UI.DURATION]}
                  className="vocabulary-audio-player rounded-md"
                />
              ) : (
                <p className="pt-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                  {ADMIN_VOCABULARY_CONTENT.form.audioEmptyLabel}
                </p>
              )}
            </div>
          </div>
        </FormItem>
      )}
    />
  )
}