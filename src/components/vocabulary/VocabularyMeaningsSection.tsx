import { XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { VocabularyUpsertInput } from '@/lib/validations/vocabularyAdmin'
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form'

interface PartOfSpeechOption {
  value: string
  label: string
}

interface VocabularyMeaningsSectionProps {
  form: UseFormReturn<VocabularyUpsertInput>
  meaningFieldArray: UseFieldArrayReturn<VocabularyUpsertInput, 'meanings', 'id'>
  partOfSpeechOptions: readonly PartOfSpeechOption[]
  definitionInputByMeaningId: Record<string, string>
  onDefinitionInputChange: (meaningFieldId: string, value: string) => void
  onAddDefinition: (index: number, meaningFieldId: string) => void
  onRemoveDefinition: (index: number, value: string) => void
}

export function VocabularyMeaningsSection({
  form,
  meaningFieldArray,
  partOfSpeechOptions,
  definitionInputByMeaningId,
  onDefinitionInputChange,
  onAddDefinition,
  onRemoveDefinition,
}: VocabularyMeaningsSectionProps) {
  return (
    <div className="space-y-4">
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
              <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.form.sections.meaningItemLabel(index + 1)}</p>
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
                      <Select value={meaningField.value ?? ''} onValueChange={(value) => meaningField.onChange(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.meaningPartOfSpeechPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {partOfSpeechOptions.map((option) => (
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
                name={`meanings.${index}.definitions`}
                render={() => (
                  <FormItem>
                    <FormLabel>{ADMIN_VOCABULARY_CONTENT.form.fields.meaningDefinitionsLabel}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          value={definitionInputByMeaningId[field.id] ?? ''}
                          placeholder={ADMIN_VOCABULARY_CONTENT.form.fields.meaningDefinitionsPlaceholder}
                          onChange={(event) => onDefinitionInputChange(field.id, event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              onAddDefinition(index, field.id)
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={() => onAddDefinition(index, field.id)}>
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => onRemoveDefinition(index, definition)}
                      aria-label={ADMIN_VOCABULARY_CONTENT.form.removeDefinitionLabel}
                    >
                      <XIcon size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
