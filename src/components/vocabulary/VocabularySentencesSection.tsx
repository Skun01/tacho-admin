import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { FillBlankConfigDialog, type FillBlankConfigValues } from '@/components/learning/FillBlankConfigDialog'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { VOCABULARY_LEVEL_OPTIONS } from '@/types/vocabularyAdmin'
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'

const F = ADMIN_VOCABULARY_CONTENT.form.fields

interface LibrarySentenceItem {
  id: string
  text: string
  meaning: string
  level: string | null
}

interface VocabularySentencesSectionProps {
  form: UseFormReturn<VocabularyUpsertInput>
  sentenceFieldArray: UseFieldArrayReturn<VocabularyUpsertInput, 'sentences', 'id'>
  libraryKeyword: string
  onLibraryKeywordChange: (value: string) => void
  libraryItems: LibrarySentenceItem[]
  isLoadingLibrary: boolean
  onSearchSentenceLibrary: () => Promise<void>
  onAddSentenceFromLibrary: (item: LibrarySentenceItem) => void
  onAddNewSentence: () => void
}

export function VocabularySentencesSection({
  form,
  sentenceFieldArray,
  libraryKeyword,
  onLibraryKeywordChange,
  libraryItems,
  isLoadingLibrary,
  onSearchSentenceLibrary,
  onAddSentenceFromLibrary,
  onAddNewSentence,
}: VocabularySentencesSectionProps) {
  const [configDialogIndex, setConfigDialogIndex] = useState<number | null>(null)

  const activeSentence = configDialogIndex !== null ? form.getValues(`sentences.${configDialogIndex}`) : null

  const handleSaveConfig = (values: FillBlankConfigValues) => {
    if (configDialogIndex === null) return
    form.setValue(`sentences.${configDialogIndex}.blankWord`, values.blankWord, { shouldDirty: true })
    form.setValue(`sentences.${configDialogIndex}.hint`, values.hint, { shouldDirty: true })
    form.setValue(`sentences.${configDialogIndex}.answerList`, values.answerList, { shouldDirty: true })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onAddNewSentence}>
          {ADMIN_VOCABULARY_CONTENT.form.addSentenceLabel}
        </Button>
      </div>

      <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.form.sentenceLibraryTitle}</p>
        <div className="flex gap-2">
          <Input
            value={libraryKeyword}
            placeholder={ADMIN_VOCABULARY_CONTENT.form.sentenceLibraryPlaceholder}
            onChange={(event) => onLibraryKeywordChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void onSearchSentenceLibrary()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => void onSearchSentenceLibrary()} disabled={isLoadingLibrary}>
            {ADMIN_VOCABULARY_CONTENT.form.searchSentenceLibraryLabel}
          </Button>
        </div>

        {libraryItems.length > 0 && (
          <div className="space-y-2">
            {libraryItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-md border p-2" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium">{item.text}</p>
                  <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{item.meaning}</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => onAddSentenceFromLibrary(item)}>
                  {ADMIN_VOCABULARY_CONTENT.form.addSentenceFromLibraryLabel}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {sentenceFieldArray.fields.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_VOCABULARY_CONTENT.form.sentencesEmptyLabel}
        </p>
      ) : (
        <div className="space-y-3">
          {sentenceFieldArray.fields.map((field, index) => {
            const hasBlankConfig = !!(form.watch(`sentences.${index}.blankWord`) || form.watch(`sentences.${index}.answerList`)?.length)

            return (
              <div key={field.id} className="space-y-3 rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.form.sections.sentenceItemLabel(index + 1)}</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => sentenceFieldArray.remove(index)}>
                    {ADMIN_VOCABULARY_CONTENT.form.removeSentenceLabel}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`sentences.${index}.text`}
                  render={({ field: sentenceField }) => (
                    <FormItem>
                      <FormLabel>{F.sentenceTextLabel}</FormLabel>
                      <FormControl>
                        <Input {...sentenceField} placeholder={F.sentenceTextPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sentences.${index}.meaning`}
                  render={({ field: sentenceField }) => (
                    <FormItem>
                      <FormLabel>{F.sentenceMeaningLabel}</FormLabel>
                      <FormControl>
                        <Input {...sentenceField} placeholder={F.sentenceMeaningPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sentences.${index}.level`}
                  render={({ field: sentenceField }) => (
                    <FormItem>
                      <FormLabel>{F.sentenceLevelLabel}</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {VOCABULARY_LEVEL_OPTIONS.map((level) => (
                          <Button
                            key={level}
                            type="button"
                            size="sm"
                            variant={sentenceField.value === level ? 'default' : 'outline'}
                            onClick={() => sentenceField.onChange(sentenceField.value === level ? null : level)}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-1.5"
                  onClick={() => setConfigDialogIndex(index)}
                >
                  <PencilSimpleIcon size={14} />
                  {F.fillBlankToggleLabel}
                  {hasBlankConfig && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{ backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)' }}
                    >
                      Đã cấu hình
                    </span>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      )}

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
