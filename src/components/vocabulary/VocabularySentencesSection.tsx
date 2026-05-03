import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { VOCABULARY_LEVEL_OPTIONS } from '@/types/vocabularyAdmin'
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'

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
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{ADMIN_VOCABULARY_CONTENT.form.sections.sentencesTitle}</h3>
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
          {sentenceFieldArray.fields.map((field, index) => (
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
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.sentenceTextLabel}</FormLabel>
                    <FormControl>
                      <Input {...sentenceField} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.sentenceTextPlaceholder} />
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
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.sentenceMeaningLabel}</FormLabel>
                    <FormControl>
                      <Input {...sentenceField} placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.sentenceMeaningPlaceholder} />
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
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.sentenceLevelLabel}</FormLabel>
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
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
