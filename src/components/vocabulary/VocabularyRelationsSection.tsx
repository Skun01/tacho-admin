import { XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import type { UseFormReturn } from 'react-hook-form'

type RelationListPath = 'synonyms' | 'antonyms' | 'relatedPhrases'

interface ListSectionProps {
  form: UseFormReturn<VocabularyUpsertInput>
  path: RelationListPath
  label: string
  placeholder: string
  inputValue: string
  onInputChange: (value: string) => void
  onAddListItem: (path: RelationListPath, rawValue: string, clear: () => void) => void
  onRemoveListItem: (path: RelationListPath, value: string) => void
}

function RelationListSection({
  form,
  path,
  label,
  placeholder,
  inputValue,
  onInputChange,
  onAddListItem,
  onRemoveListItem,
}: ListSectionProps) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  placeholder={placeholder}
                  onChange={(event) => onInputChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      onAddListItem(path, inputValue, () => onInputChange(''))
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => onAddListItem(path, inputValue, () => onInputChange(''))}>
                  {ADMIN_VOCABULARY_CONTENT.form.addItemLabel}
                </Button>
              </div>

              {(field.value?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((item, index) => (
                    <Badge key={`${item}-${index}`} variant="secondary" className="gap-1 pr-1">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => onRemoveListItem(path, item)}
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
  )
}

interface VocabularyRelationsSectionProps {
  form: UseFormReturn<VocabularyUpsertInput>
  synonymInput: string
  antonymInput: string
  relatedPhraseInput: string
  onSynonymInputChange: (value: string) => void
  onAntonymInputChange: (value: string) => void
  onRelatedPhraseInputChange: (value: string) => void
  onAddListItem: (path: RelationListPath, rawValue: string, clear: () => void) => void
  onRemoveListItem: (path: RelationListPath, value: string) => void
}

export function VocabularyRelationsSection({
  form,
  synonymInput,
  antonymInput,
  relatedPhraseInput,
  onSynonymInputChange,
  onAntonymInputChange,
  onRelatedPhraseInputChange,
  onAddListItem,
  onRemoveListItem,
}: VocabularyRelationsSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold">{ADMIN_VOCABULARY_CONTENT.form.sections.relationsTitle}</h3>

      <RelationListSection
        form={form}
        path="synonyms"
        label={ADMIN_VOCABULARY_CONTENT.form.fields.synonymsLabel}
        placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.synonymsPlaceholder}
        inputValue={synonymInput}
        onInputChange={onSynonymInputChange}
        onAddListItem={onAddListItem}
        onRemoveListItem={onRemoveListItem}
      />

      <RelationListSection
        form={form}
        path="antonyms"
        label={ADMIN_VOCABULARY_CONTENT.form.fields.antonymsLabel}
        placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.antonymsPlaceholder}
        inputValue={antonymInput}
        onInputChange={onAntonymInputChange}
        onAddListItem={onAddListItem}
        onRemoveListItem={onRemoveListItem}
      />

      <RelationListSection
        form={form}
        path="relatedPhrases"
        label={ADMIN_VOCABULARY_CONTENT.form.fields.relatedPhrasesLabel}
        placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.relatedPhrasesPlaceholder}
        inputValue={relatedPhraseInput}
        onInputChange={onRelatedPhraseInputChange}
        onAddListItem={onAddListItem}
        onRemoveListItem={onRemoveListItem}
      />
    </section>
  )
}
