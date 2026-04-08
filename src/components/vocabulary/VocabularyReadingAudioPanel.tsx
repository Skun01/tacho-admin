import { SpeakerHighIcon, XIcon } from '@phosphor-icons/react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import type { VoicevoxSpeakerOption } from '@/types/voicevox'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { Control } from 'react-hook-form'
import 'react-h5-audio-player/lib/styles.css'

interface VocabularyReadingAudioPanelProps {
  control: Control<VocabularyUpsertInput>
  speakerId: number | null
  onSpeakerChange: (value: number | null) => void
  speakers: VoicevoxSpeakerOption[]
  isSubmitting: boolean
  isLoadingSpeakers: boolean
  isPreviewingAudio: boolean
  previewAudioUrl: string | null
  onPreviewAudio: () => void
  onClearPreviewAudio: () => void
}

export function VocabularyReadingAudioPanel({
  control,
  speakerId,
  onSpeakerChange,
  speakers,
  isSubmitting,
  isLoadingSpeakers,
  isPreviewingAudio,
  previewAudioUrl,
  onPreviewAudio,
  onClearPreviewAudio,
}: VocabularyReadingAudioPanelProps) {
  const resolvedPreviewAudioUrl = resolveApiMediaUrl(previewAudioUrl)

  return (
    <FormField
      control={control}
      name="reading"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="inline-flex h-5 items-center leading-5">{ADMIN_VOCABULARY_CONTENT.form.fields.readingLabel}</FormLabel>
          <FormControl>
            <Input value={field.value ?? ''} onChange={(event) => field.onChange(event.target.value)} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.readingPlaceholder} />
          </FormControl>
          <FormMessage />

          <div className="mt-3 grid h-[152px] grid-rows-[auto_auto_1fr] gap-1 rounded-md border p-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--surface) 92%, var(--primary) 2%)' }}>
            <p className="text-xs font-medium">{ADMIN_VOCABULARY_CONTENT.form.audioPreviewLabel}</p>

            <div className="flex flex-wrap gap-2">
              <Select
                value={speakerId !== null ? String(speakerId) : ''}
                onValueChange={(value) => onSpeakerChange(value ? Number(value) : null)}
                disabled={isSubmitting || isLoadingSpeakers}
              >
                <SelectTrigger size="sm" className="min-w-[176px] flex-1 text-xs">
                  <SelectValue placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.speakerPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {speakers.map((speaker) => (
                    <SelectItem key={speaker.speakerId} value={String(speaker.speakerId)}>
                      {speaker.characterName} - {speaker.styleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs"
                onClick={onPreviewAudio}
                disabled={isSubmitting || isPreviewingAudio || !speakerId}
              >
                <SpeakerHighIcon size={14} />
                {ADMIN_VOCABULARY_CONTENT.form.generatePreviewLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs"
                onClick={onClearPreviewAudio}
                disabled={!previewAudioUrl || isSubmitting || isPreviewingAudio}
              >
                <XIcon size={14} />
                {ADMIN_VOCABULARY_CONTENT.form.removePreviewLabel}
              </Button>
            </div>

            <div className="overflow-hidden">
              {resolvedPreviewAudioUrl ? (
                <AudioPlayer
                  src={resolvedPreviewAudioUrl}
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
