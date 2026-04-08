import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { XIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { vocabularyUpsertSchema, type VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import { VocabularyPitchPanel } from '@/components/vocabulary/VocabularyPitchPanel'
import { VocabularyReadingAudioPanel } from '@/components/vocabulary/VocabularyReadingAudioPanel'
import { VocabularyMeaningsSection } from '@/components/vocabulary/VocabularyMeaningsSection'
import { VocabularyRelationsSection } from '@/components/vocabulary/VocabularyRelationsSection'
import { VocabularySentencesSection } from '@/components/vocabulary/VocabularySentencesSection'
import { voicevoxService } from '@/services/voicevoxService'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { VocabularyAdminDetail, VocabularyUpsertPayload } from '@/types/vocabularyAdmin'
import { VOCABULARY_LEVEL_OPTIONS, VOCABULARY_STATUS_LABELS, VOCABULARY_STATUS_OPTIONS } from '@/types/vocabularyAdmin'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'

interface VocabularyUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: VocabularyAdminDetail | null
  isSubmitting: boolean
  isLoadingDetail?: boolean
  onSubmit: (payload: VocabularyUpsertPayload) => Promise<void> | void
  onDirtyChange?: (isDirty: boolean) => void
}

export interface VocabularyUpsertFormHandle {
  submit: () => void
  submitDraft: () => void
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
  sentences: [],
}

export const VocabularyUpsertForm = forwardRef<VocabularyUpsertFormHandle, VocabularyUpsertFormProps>(function VocabularyUpsertForm({
  open,
  onOpenChange,
  mode,
  initialData,
  isSubmitting,
  isLoadingDetail = false,
  onSubmit,
  onDirtyChange,
}: VocabularyUpsertFormProps, ref) {
  const form = useForm<VocabularyUpsertInput>({
    resolver: zodResolver(vocabularyUpsertSchema) as never,
    defaultValues: DEFAULT_VALUES,
  })
  const meaningFieldArray = useFieldArray({ control: form.control, name: 'meanings' })
  const sentenceFieldArray = useFieldArray({ control: form.control, name: 'sentences' })

  const [speakerId, setSpeakerId] = useState<number | null>(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false)
  const [definitionInputByMeaningId, setDefinitionInputByMeaningId] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')
  const [synonymInput, setSynonymInput] = useState('')
  const [antonymInput, setAntonymInput] = useState('')
  const [relatedPhraseInput, setRelatedPhraseInput] = useState('')
  const [pitchPattern, setPitchPattern] = useState<number[]>([])
  const [libraryKeyword, setLibraryKeyword] = useState('')
  const [libraryItems, setLibraryItems] = useState<Array<{ id: string; text: string; meaning: string; level: string | null; speakerId: number | null }>>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
  const submitAsDraftRef = useRef(false)

  const { data: speakerResponse, isLoading: isLoadingSpeakers } = useQuery({
    queryKey: ['admin', 'voicevox', 'speakers'],
    queryFn: async () => {
      const { data } = await voicevoxService.getSpeakers()
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const speakers = speakerResponse ?? []
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
        sentences:
          initialData.sentences?.map((sentence) => ({
            id: sentence.id,
            text: sentence.text,
            meaning: sentence.meaning,
            speakerId: sentence.speakerId ?? null,
            level: sentence.level,
          })) ?? [],
      })
      setSpeakerId(initialData.speakerId ?? null)
      setPreviewAudioUrl(initialData.audioUrl ?? null)
      setDefinitionInputByMeaningId({})
      setTagInput('')
      setSynonymInput('')
      setAntonymInput('')
      setRelatedPhraseInput('')
      setPitchPattern(initialData.pitchPattern ?? [])
      setLibraryKeyword('')
      setLibraryItems([])
      return
    }

    form.reset(DEFAULT_VALUES)
    setSpeakerId(null)
    setPreviewAudioUrl(null)
    setDefinitionInputByMeaningId({})
    setTagInput('')
    setSynonymInput('')
    setAntonymInput('')
    setRelatedPhraseInput('')
    setPitchPattern([])
    setLibraryKeyword('')
    setLibraryItems([])
  }, [mode, initialData, form, open])

  useEffect(() => {
    if (readingChars.length === 0) {
      setPitchPattern([])
      return
    }

    setPitchPattern((prev) => {
      const next = prev.slice(0, readingChars.length)
      while (next.length < readingChars.length) {
        next.push(0)
      }
      return next
    })
  }, [readingChars])

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  const addDefinition = (index: number, meaningFieldId: string) => {
    const current = (definitionInputByMeaningId[meaningFieldId] ?? '').trim()
    if (!current) {
      return
    }

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
    if (!value) {
      return
    }

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

  const handlePreviewAudio = async () => {
    if (!speakerId) {
      gooeyToast.warning(ADMIN_VOCABULARY_CONTENT.form.speakerRequiredLabel)
      return
    }

    try {
      setIsPreviewingAudio(true)
      const reading = form.getValues('reading').trim()
      const title = form.getValues('title').trim()
      const { data } = await voicevoxService.preview({
        speakerId,
        text: reading || title || undefined,
      })

      setPreviewAudioUrl(data.data.audioUrl)
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.form.previewAudioSuccessLabel)
    } catch {
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.form.previewAudioFailedLabel)
    } finally {
      setIsPreviewingAudio(false)
    }
  }

  const handleSearchSentenceLibrary = async () => {
    const keyword = libraryKeyword.trim()
    if (!keyword) {
      setLibraryItems([])
      return
    }

    try {
      setIsLoadingLibrary(true)
      const { data } = await sentenceAdminService.search({
        q: keyword,
        page: 1,
        pageSize: 8,
      })

      setLibraryItems(
        (data.data ?? []).map((item) => ({
          id: item.id,
          text: item.text,
          meaning: item.meaning,
          level: item.level,
          speakerId: item.speakerId,
        })),
      )
    } catch {
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.form.searchSentenceLibraryFailedLabel)
    } finally {
      setIsLoadingLibrary(false)
    }
  }

  const addSentenceFromLibrary = (item: { id: string; text: string; meaning: string; level: string | null; speakerId: number | null }) => {
    const existing = form.getValues('sentences') ?? []
    if (existing.some((sentence) => sentence.id === item.id)) {
      return
    }

    sentenceFieldArray.append({
      id: item.id,
      text: item.text,
      meaning: item.meaning,
      level: (item.level as VocabularyUpsertInput['level']) ?? null,
      speakerId: item.speakerId,
    })
  }

  const addNewSentence = () => {
    sentenceFieldArray.append({
      text: '',
      meaning: '',
      level: null,
      speakerId,
    })
  }

  const togglePitchAt = (index: number) => {
    setPitchPattern((prev) => {
      const next = [...prev]
      next[index] = (next[index] ?? 0) > 0 ? 0 : 1
      return next
    })
  }

  const handleSubmit = async (values: VocabularyUpsertInput) => {
    const saveAsDraft = submitAsDraftRef.current
    submitAsDraftRef.current = false

    if (!speakerId) {
      gooeyToast.warning(ADMIN_VOCABULARY_CONTENT.form.speakerRequiredLabel)
      return
    }

    await onSubmit({
      title: values.title.trim(),
      summary: values.summary.trim(),
      writing: values.title.trim(),
      reading: values.reading.trim() || null,
      level: values.level ?? null,
      status: saveAsDraft ? 'Draft' : (values.status ?? 'Draft'),
      wordType: values.wordType.trim() || null,
      tags: values.tags,
      pitchPattern: pitchPattern.length > 0 ? pitchPattern : null,
      speakerId,
      meanings: values.meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech.trim(),
        definitions: meaning.definitions,
      })),
      synonyms: values.synonyms,
      antonyms: values.antonyms,
      relatedPhrases: values.relatedPhrases,
      sentences: values.sentences.map((sentence) => ({
        id: sentence.id,
        text: sentence.text.trim(),
        meaning: sentence.meaning.trim(),
        speakerId: sentence.speakerId ?? speakerId,
        level: sentence.level,
      })),
    })
  }

  const triggerSubmit = () => {
    submitAsDraftRef.current = false
    void form.handleSubmit(handleSubmit)()
  }

  const triggerDraftSubmit = () => {
    submitAsDraftRef.current = true
    void form.handleSubmit(handleSubmit, () => {
      submitAsDraftRef.current = false
    })()
  }

  useImperativeHandle(
    ref,
    () => ({
      submit: triggerSubmit,
      submitDraft: triggerDraftSubmit,
    }),
  )

  if (!open) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? ADMIN_VOCABULARY_CONTENT.form.dialogTitleCreate : ADMIN_VOCABULARY_CONTENT.form.dialogTitleEdit}</CardTitle>
        <CardDescription>{ADMIN_VOCABULARY_CONTENT.form.dialogDescription}</CardDescription>
      </CardHeader>
      <CardContent>

        {isLoadingDetail ? (
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_VOCABULARY_CONTENT.form.loadingDetailLabel}
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-base font-semibold">{ADMIN_VOCABULARY_CONTENT.form.sections.basicTitle}</h3>

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
                <VocabularyReadingAudioPanel
                  control={form.control}
                  speakerId={speakerId}
                  onSpeakerChange={setSpeakerId}
                  speakers={speakers}
                  isSubmitting={isSubmitting}
                  isLoadingSpeakers={isLoadingSpeakers}
                  isPreviewingAudio={isPreviewingAudio}
                  previewAudioUrl={previewAudioUrl}
                  onPreviewAudio={handlePreviewAudio}
                  onClearPreviewAudio={() => setPreviewAudioUrl(null)}
                />

                <VocabularyPitchPanel
                  readingChars={readingChars}
                  pitchPattern={pitchPattern}
                  pitchChart={pitchChart}
                  onTogglePitchAt={togglePitchAt}
                />
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
                            {VOCABULARY_STATUS_LABELS[status]}
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
                      <Select value={field.value ?? ''} onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.wordTypePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                        {WORD_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
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
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => removeListItem('tags', tag)}
                                  aria-label={ADMIN_VOCABULARY_CONTENT.form.removeItemLabel}
                                >
                                  <XIcon size={12} />
                                </Button>
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
              </section>

              <VocabularyMeaningsSection
                form={form}
                meaningFieldArray={meaningFieldArray}
                partOfSpeechOptions={PART_OF_SPEECH_OPTIONS}
                definitionInputByMeaningId={definitionInputByMeaningId}
                onDefinitionInputChange={(meaningFieldId, value) =>
                  setDefinitionInputByMeaningId((prev) => ({
                    ...prev,
                    [meaningFieldId]: value,
                  }))
                }
                onAddDefinition={addDefinition}
                onRemoveDefinition={removeDefinition}
              />

              <VocabularyRelationsSection
                form={form}
                synonymInput={synonymInput}
                antonymInput={antonymInput}
                relatedPhraseInput={relatedPhraseInput}
                onSynonymInputChange={setSynonymInput}
                onAntonymInputChange={setAntonymInput}
                onRelatedPhraseInputChange={setRelatedPhraseInput}
                onAddListItem={addListItem}
                onRemoveListItem={removeListItem}
              />

              <VocabularySentencesSection
                form={form}
                sentenceFieldArray={sentenceFieldArray}
                speakers={speakers}
                libraryKeyword={libraryKeyword}
                onLibraryKeywordChange={setLibraryKeyword}
                libraryItems={libraryItems}
                isLoadingLibrary={isLoadingLibrary}
                onSearchSentenceLibrary={handleSearchSentenceLibrary}
                onAddSentenceFromLibrary={addSentenceFromLibrary}
                onAddNewSentence={addNewSentence}
              />

              <div className="sticky bottom-[-24px] z-10 -mx-6 border-t bg-background/95 px-6 py-4 backdrop-blur-sm lg:bottom-[-32px]">
                <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSubmitting || isLoadingDetail}>
                  {mode === 'create' ? ADMIN_VOCABULARY_CONTENT.form.createActionLabel : ADMIN_VOCABULARY_CONTENT.form.updateActionLabel}
                </Button>
                <Button type="button" variant="outline" onClick={triggerDraftSubmit} disabled={isSubmitting || isLoadingDetail}>
                  {ADMIN_VOCABULARY_CONTENT.actions.saveDraft}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  {ADMIN_VOCABULARY_CONTENT.form.cancelActionLabel}
                </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
})
