import { useState } from 'react'
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { GRAMMAR_LEVEL_OPTIONS } from '@/types/grammarAdmin'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'
import type { VoicevoxSpeakerOption } from '@/types/voicevox'

interface GrammarSentencesSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  sentenceFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'sentences'>
  speakers: VoicevoxSpeakerOption[]
}

export function GrammarSentencesSection({
  form,
  sentenceFieldArray,
  speakers,
}: GrammarSentencesSectionProps) {
  const [libraryKeyword, setLibraryKeyword] = useState('')
  const [libraryItems, setLibraryItems] = useState<Array<{ id: string; text: string; meaning: string; level: string | null; speakerId: number | null }>>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)

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
      gooeyToast.error(ADMIN_GRAMMAR_CONTENT.form.searchSentenceLibraryFailedLabel)
    } finally {
      setIsLoadingLibrary(false)
    }
  }

  const addSentenceFromLibrary = (item: { id: string; text: string; meaning: string; level: string | null; speakerId: number | null }) => {
    const existing = form.getValues('sentences') ?? []
    if (existing.some((sentence) => sentence.id === item.id)) return

    sentenceFieldArray.append({
      id: item.id,
      text: item.text,
      meaning: item.meaning,
      level: (item.level as GrammarUpsertInput['sentences'][number]['level']) ?? null,
      speakerId: item.speakerId,
    })
  }

  const addNewSentence = () => {
    sentenceFieldArray.append({
      text: '',
      meaning: '',
      level: null,
      speakerId: null,
    })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{ADMIN_GRAMMAR_CONTENT.form.sections.sentencesTitle}</h3>
        <Button type="button" variant="outline" size="sm" onClick={addNewSentence}>
          <PlusIcon size={14} />
          {ADMIN_GRAMMAR_CONTENT.form.addSentenceLabel}
        </Button>
      </div>

      {/* Sentence library search */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-2">{ADMIN_GRAMMAR_CONTENT.form.sentenceLibraryTitle}</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--on-surface-variant)' }}
              />
              <Input
                value={libraryKeyword}
                onChange={(e) => setLibraryKeyword(e.target.value)}
                placeholder={ADMIN_GRAMMAR_CONTENT.form.sentenceLibraryPlaceholder}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSearchSentenceLibrary()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSearchSentenceLibrary}
              disabled={isLoadingLibrary}
            >
              {isLoadingLibrary ? <SpinnerGapIcon size={16} className="animate-spin" /> : <MagnifyingGlassIcon size={16} />}
              {ADMIN_GRAMMAR_CONTENT.form.searchSentenceLibraryLabel}
            </Button>
          </div>

          {libraryItems.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {libraryItems.map((item) => {
                const alreadyAdded = form.getValues('sentences')?.some((s) => s.id === item.id)
                return (
                  <li key={item.id} className="flex items-center justify-between gap-2 rounded-md p-2" style={{ background: 'var(--surface-container-low)' }}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{item.text}</p>
                      <p className="truncate text-xs" style={{ color: 'var(--on-surface-variant)' }}>{item.meaning}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={alreadyAdded}
                      onClick={() => addSentenceFromLibrary(item)}
                    >
                      <PlusIcon size={12} />
                      {ADMIN_GRAMMAR_CONTENT.form.addSentenceFromLibraryLabel}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Current sentences */}
      {sentenceFieldArray.fields.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_GRAMMAR_CONTENT.form.sentencesEmptyLabel}
        </p>
      )}

      {sentenceFieldArray.fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">
              {ADMIN_GRAMMAR_CONTENT.form.sections.sentenceItemLabel(index + 1)}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => sentenceFieldArray.remove(index)}
            >
              <TrashIcon size={14} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name={`sentences.${index}.text`}
              render={({ field: textField }) => (
                <FormItem>
                  <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.sentenceTextLabel}</FormLabel>
                  <FormControl>
                    <Input {...textField} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.sentenceTextPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`sentences.${index}.meaning`}
              render={({ field: meaningField }) => (
                <FormItem>
                  <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.sentenceMeaningLabel}</FormLabel>
                  <FormControl>
                    <Input {...meaningField} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.sentenceMeaningPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name={`sentences.${index}.level`}
                render={({ field: levelField }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.sentenceLevelLabel}</FormLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {GRAMMAR_LEVEL_OPTIONS.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          size="sm"
                          variant={levelField.value === level ? 'default' : 'outline'}
                          onClick={() => levelField.onChange(levelField.value === level ? null : level)}
                          className="h-7 text-xs"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sentences.${index}.speakerId`}
                render={({ field: speakerField }) => (
                  <FormItem>
                    <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.sentenceSpeakerLabel}</FormLabel>
                    <FormControl>
                      <Select
                        value={speakerField.value?.toString() ?? ''}
                        onValueChange={(val) => speakerField.onChange(val ? Number(val) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.sentenceSpeakerPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {speakers.map((speaker) => (
                            <SelectItem key={speaker.speakerId} value={speaker.speakerId.toString()}>
                              {speaker.characterName} ({speaker.styleName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch(`sentences.${index}.id`) && (
              <Badge variant="secondary" className="text-[10px]">
                ID: {form.watch(`sentences.${index}.id`)}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
