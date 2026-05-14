import { useState } from 'react'
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, SpinnerGapIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { FillBlankConfigDialog, type FillBlankConfigValues } from '@/components/learning/FillBlankConfigDialog'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { GRAMMAR_LEVEL_OPTIONS } from '@/types/grammarAdmin'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'

const F = ADMIN_GRAMMAR_CONTENT.form.fields

interface GrammarSentencesSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  sentenceFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'sentences'>
}

interface LibrarySentenceItem {
  id: string
  text: string
  meaning: string
  level: string | null
}

export function GrammarSentencesSection({
  form,
  sentenceFieldArray,
}: GrammarSentencesSectionProps) {
  const [libraryKeyword, setLibraryKeyword] = useState('')
  const [libraryItems, setLibraryItems] = useState<LibrarySentenceItem[]>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
  const [configDialogIndex, setConfigDialogIndex] = useState<number | null>(null)

  const activeSentence = configDialogIndex !== null ? form.getValues(`sentences.${configDialogIndex}`) : null

  const handleSaveConfig = (values: FillBlankConfigValues) => {
    if (configDialogIndex === null) return
    form.setValue(`sentences.${configDialogIndex}.blankWord`, values.blankWord, { shouldDirty: true })
    form.setValue(`sentences.${configDialogIndex}.hint`, values.hint, { shouldDirty: true })
    form.setValue(`sentences.${configDialogIndex}.answerList`, values.answerList, { shouldDirty: true })
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
        })),
      )
    } catch {
      gooeyToast.error(ADMIN_GRAMMAR_CONTENT.form.searchSentenceLibraryFailedLabel)
    } finally {
      setIsLoadingLibrary(false)
    }
  }

  const addSentenceFromLibrary = (item: LibrarySentenceItem) => {
    const existing = form.getValues('sentences') ?? []
    if (existing.some((sentence) => sentence.id === item.id)) return

    sentenceFieldArray.append({
      id: item.id,
      text: item.text,
      meaning: item.meaning,
      level: (item.level as GrammarUpsertInput['sentences'][number]['level']) ?? null,
      blankWord: '',
      hint: '',
      answerList: [],
    })
  }

  const addNewSentence = () => {
    sentenceFieldArray.append({
      text: '',
      meaning: '',
      level: null,
      blankWord: '',
      hint: '',
      answerList: [],
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
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

      {sentenceFieldArray.fields.map((field, index) => {
        const hasBlankConfig = !!(form.watch(`sentences.${index}.blankWord`) || form.watch(`sentences.${index}.answerList`)?.length)

        return (
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
                    <FormLabel>{F.sentenceTextLabel}</FormLabel>
                    <FormControl>
                      <Input {...textField} placeholder={F.sentenceTextPlaceholder} />
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
                    <FormLabel>{F.sentenceMeaningLabel}</FormLabel>
                    <FormControl>
                      <Input {...meaningField} placeholder={F.sentenceMeaningPlaceholder} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sentences.${index}.level`}
                render={({ field: levelField }) => (
                  <FormItem>
                    <FormLabel>{F.sentenceLevelLabel}</FormLabel>
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

              {form.watch(`sentences.${index}.id`) && (
                <Badge variant="secondary" className="text-[10px]">
                  ID: {form.watch(`sentences.${index}.id`)}
                </Badge>
              )}

              <Button
                type="button"
                variant={hasBlankConfig ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-center gap-1.5"
                onClick={() => setConfigDialogIndex(index)}
              >
                <PencilSimpleIcon size={14} />
                {F.fillBlankToggleLabel}
              </Button>
            </CardContent>
          </Card>
        )
      })}

      <FillBlankConfigDialog
        open={configDialogIndex !== null}
        onOpenChange={(open) => { if (!open) setConfigDialogIndex(null) }}
        sentenceText={activeSentence?.text ?? ''}
        initialValues={{
          blankWord: activeSentence?.blankWord ?? '',
          hint: activeSentence?.hint ?? '',
          answerList: activeSentence?.answerList ?? [],
        }}
        onSave={handleSaveConfig}
        labels={{
          title: F.fillBlankDialogTitle,
          description: F.fillBlankDialogDescription,
          selectHint: F.fillBlankSelectHint,
          blankWordLabel: F.blankWordLabel,
          blankWordPlaceholder: F.blankWordPlaceholder,
          hintLabel: F.hintLabel,
          hintPlaceholder: F.hintPlaceholder,
          answerListLabel: F.answerListLabel,
          answerListPlaceholder: F.answerListPlaceholder,
          saveLabel: F.fillBlankSaveLabel,
          cancelLabel: F.fillBlankCancelLabel,
        }}
      />
    </div>
  )
}
