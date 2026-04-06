import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { InfoIcon, MicrophoneIcon, StopIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { vocabularyUpsertSchema, type VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import { resourceService } from '@/services/resourceService'
import type { VocabularyAdminDetail, VocabularyUpsertPayload } from '@/types/vocabularyAdmin'
import { VOCABULARY_LEVEL_OPTIONS, VOCABULARY_STATUS_OPTIONS } from '@/types/vocabularyAdmin'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'

interface VocabularyUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: VocabularyAdminDetail | null
  isSubmitting: boolean
  isLoadingDetail?: boolean
  onSubmit: (payload: VocabularyUpsertPayload) => void
}

const STATUS_LABELS: Record<(typeof VOCABULARY_STATUS_OPTIONS)[number], string> = {
  Draft: 'Bản nháp',
  Published: 'Đã xuất bản',
  Archived: 'Đã lưu trữ',
}

const WORD_TYPE_OPTIONS = [
  { value: 'Native', label: 'Từ thuần Nhật (Wago)' },
  { value: 'SinoJapanese', label: 'Từ Hán Nhật (Kango)' },
  { value: 'Loanword', label: 'Từ vay mượn (Gairaigo)' },
] as const

const PART_OF_SPEECH_OPTIONS = [
  { value: 'Noun', label: 'Danh từ' },
  { value: 'VerbU', label: 'Động từ nhóm U' },
  { value: 'VerbRu', label: 'Động từ nhóm RU' },
  { value: 'IAdj', label: 'Tính từ đuôi I' },
  { value: 'NaAdj', label: 'Tính từ đuôi NA' },
  { value: 'Adverb', label: 'Trạng từ' },
  { value: 'Particle', label: 'Trợ từ' },
  { value: 'Conjunction', label: 'Liên từ' },
  { value: 'Interjection', label: 'Thán từ' },
] as const

const DEFAULT_VALUES: VocabularyUpsertInput = {
  title: '',
  summary: '',
  reading: '',
  level: null,
  status: 'Draft',
  wordType: '',
  tags: [],
  meanings: [{ partOfSpeech: '', definitions: [] }],
  synonyms: [],
  antonyms: [],
  relatedPhrases: [],
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

export function VocabularyUpsertForm({
  open,
  onOpenChange,
  mode,
  initialData,
  isSubmitting,
  isLoadingDetail = false,
  onSubmit,
}: VocabularyUpsertFormProps) {
  const form = useForm<VocabularyUpsertInput>({
    resolver: zodResolver(vocabularyUpsertSchema) as never,
    defaultValues: DEFAULT_VALUES,
  })
  const meaningFieldArray = useFieldArray({ control: form.control, name: 'meanings' })

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [definitionInputByMeaningId, setDefinitionInputByMeaningId] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')
  const [synonymInput, setSynonymInput] = useState('')
  const [antonymInput, setAntonymInput] = useState('')
  const [relatedPhraseInput, setRelatedPhraseInput] = useState('')
  const [pitchPattern, setPitchPattern] = useState<number[]>([])
  const audioInputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const audioPreviewUrl = useMemo(() => audioUrl ?? initialData?.audioUrl ?? null, [audioUrl, initialData?.audioUrl])
  const watchedReading = useWatch({ control: form.control, name: 'reading' })
  const readingChars = useMemo(() => Array.from((watchedReading ?? '').trim()), [watchedReading])
  const pitchChart = useMemo(() => {
    if (readingChars.length === 0) {
      return { width: 120, syllableWidth: 36, points: [] as string[], circles: [] as Array<{ key: string; cx: number; cy: number }> }
    }

    const SYLLABLE_WIDTH = 34
    const width = readingChars.length * SYLLABLE_WIDTH

    const circles = readingChars.map((char, index) => {
      const cx = index * SYLLABLE_WIDTH + SYLLABLE_WIDTH / 2
      const cy = (pitchPattern[index] ?? 0) > 0 ? 5 : 19
      return {
        key: `${char}-${index}`,
        cx,
        cy,
      }
    })

    return {
      width,
      syllableWidth: SYLLABLE_WIDTH,
      points: circles.map((point) => `${point.cx},${point.cy}`),
      circles,
    }
  }, [pitchPattern, readingChars])

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        title: initialData.title,
        summary: initialData.summary,
        reading: initialData.reading ?? '',
        level: (initialData.level as VocabularyUpsertInput['level']) ?? null,
        status: (initialData.status as VocabularyUpsertInput['status']) ?? 'Draft',
        wordType: initialData.wordType ?? '',
        tags: initialData.tags ?? [],
        meanings:
          initialData.meanings?.length > 0
            ? initialData.meanings.map((meaning) => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions,
              }))
            : [{ partOfSpeech: '', definitions: [] }],
        synonyms: initialData.synonyms ?? [],
        antonyms: initialData.antonyms ?? [],
        relatedPhrases: initialData.relatedPhrases ?? [],
      })
      setAudioUrl(initialData.audioUrl ?? null)
      setDefinitionInputByMeaningId({})
      setTagInput('')
      setSynonymInput('')
      setAntonymInput('')
      setRelatedPhraseInput('')
      setPitchPattern(initialData.pitchPattern ?? [])
      return
    }

    form.reset(DEFAULT_VALUES)
    setAudioUrl(null)
    setDefinitionInputByMeaningId({})
    setTagInput('')
    setSynonymInput('')
    setAntonymInput('')
    setRelatedPhraseInput('')
    setPitchPattern([])
  }, [mode, initialData, form, open])

  useEffect(() => {
    if (readingChars.length === 0) {
      setPitchPattern([])
      return
    }

    setPitchPattern((prev) => {
      const trimmed = prev.slice(0, readingChars.length)
      while (trimmed.length < readingChars.length) {
        trimmed.push(0)
      }
      return trimmed
    })
  }, [readingChars])

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
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.form.uploadAudioSuccess)
    } catch {
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.form.uploadAudioFailed)
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
      gooeyToast.warning(ADMIN_VOCABULARY_CONTENT.form.recordNotSupportedLabel)
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
            const fileBaseName = `vocabulary-${Date.now()}`
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
          gooeyToast.error(ADMIN_VOCABULARY_CONTENT.form.uploadAudioFailed)
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
      gooeyToast.warning(ADMIN_VOCABULARY_CONTENT.form.recordNotAllowedLabel)
    }
  }

  const stopRecord = () => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
    setIsRecording(false)
  }

  const addDefinition = (index: number, meaningFieldId: string) => {
    const current = (definitionInputByMeaningId[meaningFieldId] ?? '').trim()
    if (!current) return

    const path = `meanings.${index}.definitions` as const
    const existing = form.getValues(path) ?? []
    if (existing.includes(current)) {
      setDefinitionInputByMeaningId((prev) => ({ ...prev, [meaningFieldId]: '' }))
      return
    }

    form.setValue(path, [...existing, current], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setDefinitionInputByMeaningId((prev) => ({ ...prev, [meaningFieldId]: '' }))
  }

  const removeDefinition = (index: number, value: string) => {
    const path = `meanings.${index}.definitions` as const
    const existing = form.getValues(path) ?? []
    form.setValue(path, existing.filter((item) => item !== value), { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const addListItem = (path: 'tags' | 'synonyms' | 'antonyms' | 'relatedPhrases', rawValue: string, clear: () => void) => {
    const value = rawValue.trim()
    if (!value) return

    const existing = form.getValues(path) ?? []
    if (existing.includes(value)) {
      clear()
      return
    }

    form.setValue(path, [...existing, value], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    clear()
  }

  const removeListItem = (path: 'tags' | 'synonyms' | 'antonyms' | 'relatedPhrases', value: string) => {
    const existing = form.getValues(path) ?? []
    form.setValue(path, existing.filter((item) => item !== value), { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const togglePitchAt = (index: number) => {
    setPitchPattern((prev) => {
      const next = [...prev]
      next[index] = (next[index] ?? 0) > 0 ? 0 : 1
      return next
    })
  }

  const handleSubmit = (values: VocabularyUpsertInput) => {
    onSubmit({
      title: values.title.trim(),
      summary: values.summary.trim(),
      writing: values.title.trim(),
      reading: values.reading.trim() || null,
      level: values.level ?? null,
      status: values.status ?? 'Draft',
      wordType: values.wordType.trim() || null,
      tags: values.tags,
      pitchPattern: pitchPattern.length > 0 ? pitchPattern : null,
      audioUrl: audioPreviewUrl,
      meanings: values.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech.trim(),
        definitions: meaning.definitions,
      })),
      synonyms: values.synonyms,
      antonyms: values.antonyms,
      relatedPhrases: values.relatedPhrases,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-[820px] overflow-y-auto lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? ADMIN_VOCABULARY_CONTENT.form.dialogTitleCreate : ADMIN_VOCABULARY_CONTENT.form.dialogTitleEdit}</DialogTitle>
          <DialogDescription>{ADMIN_VOCABULARY_CONTENT.form.dialogDescription}</DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_VOCABULARY_CONTENT.form.loadingDetailLabel}
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.titleLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.titlePlaceholder} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.summaryLabel}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.summaryPlaceholder} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline-flex h-5 items-center leading-5">{ADMIN_VOCABULARY_CONTENT.form.fields.readingLabel}</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} onChange={(event) => field.onChange(event.target.value)} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.readingPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="inline-flex h-5 items-center leading-5">{ADMIN_VOCABULARY_CONTENT.form.pitchPatternLabel}</FormLabel>
                  <div className="space-y-1.5">
                    {readingChars.length > 0 ? (
                      <div className="overflow-x-auto rounded-md border px-2 py-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--surface) 90%, var(--primary) 2%)' }}>
                        <div className="mx-auto" style={{ width: pitchChart.width }}>
                          <svg className="h-6" style={{ width: pitchChart.width }} viewBox={`0 0 ${pitchChart.width} 24`} role="img" aria-label={ADMIN_VOCABULARY_CONTENT.form.pitchContourLabel}>
                            <line x1={0} y1={12} x2={pitchChart.width} y2={12} stroke="var(--border)" strokeWidth={1} />
                            {pitchChart.points.length > 1 && <polyline points={pitchChart.points.join(' ')} fill="none" stroke="var(--primary)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />}
                            {pitchChart.circles.map((point) => (
                              <circle key={point.key} cx={point.cx} cy={point.cy} r={2.5} fill="var(--primary)" />
                            ))}
                          </svg>

                          <div className="mt-0.5 flex" style={{ width: pitchChart.width }}>
                            {readingChars.map((char, index) => {
                              const isHigh = (pitchPattern[index] ?? 0) > 0
                              return (
                                <div key={`${char}-${index}`} className="flex justify-center" style={{ width: pitchChart.syllableWidth }}>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-full min-w-0 px-0.5 text-xs font-medium"
                                    style={{ color: isHigh ? 'var(--primary)' : 'var(--on-surface)' }}
                                    onClick={() => togglePitchAt(index)}
                                    aria-label={`${char} ${isHigh ? ADMIN_VOCABULARY_CONTENT.form.pitchPatternHighLabel : ADMIN_VOCABULARY_CONTENT.form.pitchPatternLowLabel}`}
                                  >
                                    {char}
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <p className="mt-1 text-center text-[11px]" style={{ color: 'var(--on-surface-variant)' }}>
                          {ADMIN_VOCABULARY_CONTENT.form.pitchPatternDescriptionLabel}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        {ADMIN_VOCABULARY_CONTENT.form.pitchPatternEmptyLabel}
                      </p>
                    )}
                  </div>
                </FormItem>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.levelLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {VOCABULARY_LEVEL_OPTIONS.map((level) => (
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.statusLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {VOCABULARY_STATUS_OPTIONS.map((status) => (
                          <Button
                            key={status}
                            type="button"
                            size="sm"
                            variant={field.value === status ? 'default' : 'outline'}
                            onClick={() => field.onChange(status)}
                          >
                            {STATUS_LABELS[status]}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="wordType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.wordTypeLabel}</FormLabel>
                    <FormControl>
                      <select
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        <option value="">{ADMIN_VOCABULARY_CONTENT.form.fields.wordTypePlaceholder}</option>
                        {WORD_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.tagsLabel}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={tagInput}
                            placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.tagsPlaceholder}
                            onChange={(event) => setTagInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addListItem('tags', tagInput, () => setTagInput(''))
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={() => addListItem('tags', tagInput, () => setTagInput(''))}>
                            {ADMIN_VOCABULARY_CONTENT.form.addItemLabel}
                          </Button>
                        </div>

                        {(field.value?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag, index) => (
                              <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  className="rounded-sm p-0.5 hover:bg-black/10"
                                  onClick={() => removeListItem('tags', tag)}
                                  aria-label={ADMIN_VOCABULARY_CONTENT.form.removeItemLabel}
                                >
                                  <XIcon size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.form.fields.meaningDefinitionsLabel}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => meaningFieldArray.append({ partOfSpeech: '', definitions: [] })}
                  >
                    {ADMIN_VOCABULARY_CONTENT.form.addMeaningLabel}
                  </Button>
                </div>

                {meaningFieldArray.fields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">Nghĩa #{index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => meaningFieldArray.remove(index)}
                        disabled={meaningFieldArray.fields.length <= 1}
                      >
                        {ADMIN_VOCABULARY_CONTENT.form.removeMeaningLabel}
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`meanings.${index}.partOfSpeech`}
                        render={({ field: meaningField }) => (
                          <FormItem>
                            <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.meaningPartOfSpeechLabel}</FormLabel>
                            <FormControl>
                              <select
                                value={meaningField.value ?? ''}
                                onChange={(event) => meaningField.onChange(event.target.value)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                              >
                                <option value="">{ADMIN_VOCABULARY_CONTENT.form.fields.meaningPartOfSpeechPlaceholder}</option>
                                {PART_OF_SPEECH_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`meanings.${index}.definitions`}
                        render={() => (
                          <FormItem>
                            <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.meaningDefinitionsLabel}</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  value={definitionInputByMeaningId[field.id] ?? ''}
                                  placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.meaningDefinitionsPlaceholder}
                                  onChange={(event) =>
                                    setDefinitionInputByMeaningId((prev) => ({
                                      ...prev,
                                      [field.id]: event.target.value,
                                    }))
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      event.preventDefault()
                                      addDefinition(index, field.id)
                                    }
                                  }}
                                />
                                <Button type="button" variant="outline" onClick={() => addDefinition(index, field.id)}>
                                  {ADMIN_VOCABULARY_CONTENT.form.addDefinitionLabel}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {(form.watch(`meanings.${index}.definitions`)?.length ?? 0) > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.watch(`meanings.${index}.definitions`).map((definition, definitionIndex) => (
                          <Badge key={`${definition}-${definitionIndex}`} variant="secondary" className="gap-1 pr-1">
                            <span>{definition}</span>
                            <button
                              type="button"
                              className="rounded-sm p-0.5 hover:bg-black/10"
                              onClick={() => removeDefinition(index, definition)}
                              aria-label={ADMIN_VOCABULARY_CONTENT.form.removeDefinitionLabel}
                            >
                              <XIcon size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="synonyms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.synonymsLabel}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={synonymInput}
                            placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.synonymsPlaceholder}
                            onChange={(event) => setSynonymInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addListItem('synonyms', synonymInput, () => setSynonymInput(''))
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={() => addListItem('synonyms', synonymInput, () => setSynonymInput(''))}>
                            {ADMIN_VOCABULARY_CONTENT.form.addItemLabel}
                          </Button>
                        </div>

                        {(field.value?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((item, index) => (
                              <Badge key={`${item}-${index}`} variant="secondary" className="gap-1 pr-1">
                                <span>{item}</span>
                                <button
                                  type="button"
                                  className="rounded-sm p-0.5 hover:bg-black/10"
                                  onClick={() => removeListItem('synonyms', item)}
                                  aria-label={ADMIN_VOCABULARY_CONTENT.form.removeItemLabel}
                                >
                                  <XIcon size={12} />
                                </button>
                              </Badge>
                            ))}
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
                name="antonyms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.antonymsLabel}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={antonymInput}
                            placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.antonymsPlaceholder}
                            onChange={(event) => setAntonymInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addListItem('antonyms', antonymInput, () => setAntonymInput(''))
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={() => addListItem('antonyms', antonymInput, () => setAntonymInput(''))}>
                            {ADMIN_VOCABULARY_CONTENT.form.addItemLabel}
                          </Button>
                        </div>

                        {(field.value?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((item, index) => (
                              <Badge key={`${item}-${index}`} variant="secondary" className="gap-1 pr-1">
                                <span>{item}</span>
                                <button
                                  type="button"
                                  className="rounded-sm p-0.5 hover:bg-black/10"
                                  onClick={() => removeListItem('antonyms', item)}
                                  aria-label={ADMIN_VOCABULARY_CONTENT.form.removeItemLabel}
                                >
                                  <XIcon size={12} />
                                </button>
                              </Badge>
                            ))}
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
                name="relatedPhrases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.relatedPhrasesLabel}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={relatedPhraseInput}
                            placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.relatedPhrasesPlaceholder}
                            onChange={(event) => setRelatedPhraseInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addListItem('relatedPhrases', relatedPhraseInput, () => setRelatedPhraseInput(''))
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={() => addListItem('relatedPhrases', relatedPhraseInput, () => setRelatedPhraseInput(''))}>
                            {ADMIN_VOCABULARY_CONTENT.form.addItemLabel}
                          </Button>
                        </div>

                        {(field.value?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((item, index) => (
                              <Badge key={`${item}-${index}`} variant="secondary" className="gap-1 pr-1">
                                <span>{item}</span>
                                <button
                                  type="button"
                                  className="rounded-sm p-0.5 hover:bg-black/10"
                                  onClick={() => removeListItem('relatedPhrases', item)}
                                  aria-label={ADMIN_VOCABULARY_CONTENT.form.removeItemLabel}
                                >
                                  <XIcon size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.audioFileLabel}</FormLabel>
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
                        {ADMIN_VOCABULARY_CONTENT.form.audioFileHintLabel}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <div className="flex flex-wrap items-center gap-2">
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
                      {ADMIN_VOCABULARY_CONTENT.form.uploadAudioLabel}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startRecord}
                      disabled={isRecording || isUploadingAudio || isSubmitting}
                    >
                      <MicrophoneIcon size={16} />
                      {ADMIN_VOCABULARY_CONTENT.form.recordAudioLabel}
                    </Button>
                    <Button
                      type="button"
                      variant={isRecording ? 'destructive' : 'outline'}
                      className={isRecording ? 'animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : undefined}
                      onClick={stopRecord}
                      disabled={!isRecording || isUploadingAudio || isSubmitting}
                    >
                      <StopIcon size={16} />
                      {ADMIN_VOCABULARY_CONTENT.form.stopRecordLabel}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setAudioUrl(null)}
                      disabled={!audioPreviewUrl || isUploadingAudio || isSubmitting || isRecording}
                    >
                      <XIcon size={16} />
                      {ADMIN_VOCABULARY_CONTENT.form.removeAudioLabel}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              {isUploadingAudio && (
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {ADMIN_VOCABULARY_CONTENT.form.uploadingAudioLabel}
                </p>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.form.audioPreviewLabel}</p>
                {audioPreviewUrl ? (
                  <audio controls src={audioPreviewUrl} className="w-full" />
                ) : (
                  <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                    {ADMIN_VOCABULARY_CONTENT.form.audioEmptyLabel}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSubmitting || isLoadingDetail}>
                  {mode === 'create' ? ADMIN_VOCABULARY_CONTENT.form.createActionLabel : ADMIN_VOCABULARY_CONTENT.form.updateActionLabel}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  {ADMIN_VOCABULARY_CONTENT.form.cancelActionLabel}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
