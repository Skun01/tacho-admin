import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { InfoIcon, MicrophoneIcon, StopIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sentenceUpsertSchema, type SentenceUpsertInput } from '@/lib/validations/sentenceAdmin'
import { resourceService } from '@/services/resourceService'
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

const SUPPORTED_AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4'] as const
const PREFERRED_RECORDING_MIME_TYPES = ['audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/webm;codecs=opus', 'audio/webm'] as const

function getFileExtensionFromMimeType(mimeType: string) {
  if (mimeType === 'audio/mpeg') return 'mp3'
  if (mimeType === 'audio/wav') return 'wav'
  if (mimeType === 'audio/mp4') return 'm4a'
  return 'wav'
}

function mergeChannels(buffer: AudioBuffer) {
  const channelCount = buffer.numberOfChannels
  const length = buffer.length

  if (channelCount === 1) {
    return buffer.getChannelData(0)
  }

  const merged = new Float32Array(length * channelCount)
  for (let index = 0; index < length; index += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      merged[index * channelCount + channel] = buffer.getChannelData(channel)[index]
    }
  }

  return merged
}

function encodeWavFromAudioBuffer(buffer: AudioBuffer) {
  const samples = mergeChannels(buffer)
  const bytesPerSample = 2
  const blockAlign = buffer.numberOfChannels * bytesPerSample
  const byteRate = buffer.sampleRate * blockAlign
  const dataLength = samples.length * bytesPerSample
  const wavBuffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(wavBuffer)

  let offset = 0
  const writeString = (value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
    offset += value.length
  }

  writeString('RIFF')
  view.setUint32(offset, 36 + dataLength, true)
  offset += 4
  writeString('WAVE')
  writeString('fmt ')
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, buffer.numberOfChannels, true)
  offset += 2
  view.setUint32(offset, buffer.sampleRate, true)
  offset += 4
  view.setUint32(offset, byteRate, true)
  offset += 4
  view.setUint16(offset, blockAlign, true)
  offset += 2
  view.setUint16(offset, 16, true)
  offset += 2
  writeString('data')
  view.setUint32(offset, dataLength, true)
  offset += 4

  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
    offset += 2
  }

  return wavBuffer
}

async function convertBlobToWavFile(blob: Blob, fileNameBase: string) {
  const audioContext = new AudioContext()

  try {
    const arrayBuffer = await blob.arrayBuffer()
    const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0))
    const wav = encodeWavFromAudioBuffer(decoded)
    return new File([wav], `${fileNameBase}.wav`, { type: 'audio/wav' })
  } finally {
    await audioContext.close()
  }
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioInputRef = useRef<HTMLInputElement | null>(null)

  const audioPreviewUrl = useMemo(() => audioUrl ?? initialData?.audioUrl ?? null, [audioUrl, initialData?.audioUrl])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        text: initialData.text,
        meaning: initialData.meaning,
        level: (initialData.level ?? undefined) as SentenceUpsertInput['level'],
      })
      setAudioUrl(initialData.audioUrl ?? null)
      return
    }

    form.reset(DEFAULT_VALUES)
    setAudioUrl(null)
  }, [mode, initialData, form, open])

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const uploadAudioFile = async (file: File) => {
    try {
      setIsUploadingAudio(true)
      const { data } = await resourceService.uploadAudio(file)
      setAudioUrl(data.data.fileUrl)
      gooeyToast.success(ADMIN_SENTENCE_CONTENT.form.uploadAudioSuccess)
    } catch {
      gooeyToast.error(ADMIN_SENTENCE_CONTENT.form.uploadAudioFailed)
    } finally {
      setIsUploadingAudio(false)
    }
  }

  const handleFilePicked: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadAudioFile(file)
    event.target.value = ''
  }

  const startRecord = async () => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      gooeyToast.warning(ADMIN_SENTENCE_CONTENT.form.recordNotSupportedLabel)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const recorderMimeType = PREFERRED_RECORDING_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
      const recorder = recorderMimeType ? new MediaRecorder(stream, { mimeType: recorderMimeType }) : new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        try {
          const mimeType = recorder.mimeType || chunksRef.current[0]?.type || 'audio/webm'
          const blob = new Blob(chunksRef.current, { type: mimeType })
          if (blob.size > 0) {
            const fileBaseName = `sentence-${Date.now()}`
            let recordedFile: File

            if (SUPPORTED_AUDIO_MIME_TYPES.includes(mimeType as (typeof SUPPORTED_AUDIO_MIME_TYPES)[number])) {
              const extension = getFileExtensionFromMimeType(mimeType)
              recordedFile = new File([blob], `${fileBaseName}.${extension}`, { type: mimeType })
            } else {
              recordedFile = await convertBlobToWavFile(blob, fileBaseName)
            }

            await uploadAudioFile(recordedFile)
          }
        } catch {
          gooeyToast.error(ADMIN_SENTENCE_CONTENT.form.uploadAudioFailed)
        } finally {
          mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
          mediaStreamRef.current = null
          setIsRecording(false)
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch {
      gooeyToast.warning(ADMIN_SENTENCE_CONTENT.form.recordNotAllowedLabel)
    }
  }

  const stopRecord = () => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
    setIsRecording(false)
  }

  const handleSubmit = (values: SentenceUpsertInput) => {
    onSubmit({
      text: values.text.trim(),
      meaning: values.meaning.trim(),
      audioUrl: audioPreviewUrl,
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
              <div className="flex items-center gap-2">
                <FormLabel>{ADMIN_SENTENCE_CONTENT.form.fields.audioFileLabel}</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Định dạng audio được hỗ trợ"
                      >
                        <InfoIcon size={16} weight="duotone" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>
                      {ADMIN_SENTENCE_CONTENT.form.fields.audioFileHintLabel}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <div>
                  <Input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp4"
                    onChange={handleFilePicked}
                    disabled={isUploadingAudio || isRecording || isSubmitting}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isUploadingAudio || isRecording || isSubmitting}
                  >
                    <UploadSimpleIcon size={16} />
                    {ADMIN_SENTENCE_CONTENT.form.uploadAudioLabel}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={startRecord}
                disabled={isRecording || isUploadingAudio || isSubmitting}
              >
                <MicrophoneIcon size={16} />
                {ADMIN_SENTENCE_CONTENT.form.recordAudioLabel}
              </Button>
              <Button
                type="button"
                variant={isRecording ? 'destructive' : 'outline'}
                className={isRecording ? 'animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : undefined}
                onClick={stopRecord}
                disabled={!isRecording || isUploadingAudio || isSubmitting}
              >
                <StopIcon size={16} />
                {ADMIN_SENTENCE_CONTENT.form.stopRecordLabel}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAudioUrl(null)}
                disabled={!audioPreviewUrl || isUploadingAudio || isSubmitting}
              >
                <XIcon size={16} />
                {ADMIN_SENTENCE_CONTENT.form.removeAudioLabel}
              </Button>
            </div>

            {isUploadingAudio && (
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {ADMIN_SENTENCE_CONTENT.form.uploadingAudioLabel}
              </p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">{ADMIN_SENTENCE_CONTENT.form.audioPreviewLabel}</p>
              {audioPreviewUrl ? (
                <audio controls src={audioPreviewUrl} className="w-full" />
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
