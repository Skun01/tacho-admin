import { PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RichTextEditor } from '@/components/grammar/RichTextEditor'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'
import { useState } from 'react'

interface GrammarStructuresSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  structureFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'structures'>
}

export function GrammarStructuresSection({ form, structureFieldArray }: GrammarStructuresSectionProps) {
  const [annotationInputs, setAnnotationInputs] = useState<Record<number, { key: string; value: string }>>({})

  const addAnnotation = (structureIndex: number) => {
    const input = annotationInputs[structureIndex]
    if (!input?.key?.trim() || !input?.value?.trim()) return

    const path = `structures.${structureIndex}.annotations` as const
    const existing = form.getValues(path) ?? {}
    const key = input.key.trim()

    form.setValue(
      path,
      { ...existing, [key]: input.value.trim() },
      { shouldValidate: true, shouldDirty: true },
    )
    setAnnotationInputs((prev) => ({ ...prev, [structureIndex]: { key: '', value: '' } }))
  }

  const removeAnnotation = (structureIndex: number, key: string) => {
    const path = `structures.${structureIndex}.annotations` as const
    const existing = form.getValues(path) ?? {}
    const { [key]: _, ...rest } = existing
    form.setValue(
      path,
      Object.keys(rest).length > 0 ? rest : null,
      { shouldValidate: true, shouldDirty: true },
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{ADMIN_GRAMMAR_CONTENT.form.sections.structuresTitle}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => structureFieldArray.append({ pattern: '', annotations: null })}
        >
          <PlusIcon size={14} />
          {ADMIN_GRAMMAR_CONTENT.form.addStructureLabel}
        </Button>
      </div>

      {structureFieldArray.fields.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_GRAMMAR_CONTENT.form.noStructuresLabel}
        </p>
      )}

      {structureFieldArray.fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">
              {ADMIN_GRAMMAR_CONTENT.form.sections.structureItemLabel(index + 1)}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => structureFieldArray.remove(index)}
            >
              <TrashIcon size={14} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pattern with rich text */}
            <FormField
              control={form.control}
              name={`structures.${index}.pattern`}
              render={({ field: patternField }) => (
                <FormItem>
                  <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.patternLabel}</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={patternField.value}
                      onChange={(val) => patternField.onChange(val ?? '')}
                      placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.patternPlaceholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Annotations */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.form.fields.annotationKeyLabel}</label>

              {/* Existing annotations */}
              {(() => {
                const annotations = form.watch(`structures.${index}.annotations`)
                if (!annotations || Object.keys(annotations).length === 0) return null
                return (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(annotations).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="gap-1.5 pr-1">
                        <span className="font-mono text-xs">({key})</span>
                        <span>{value}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => removeAnnotation(index, key)}
                        >
                          <XIcon size={10} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )
              })()}

              {/* Add annotation row */}
              <div className="flex gap-2">
                <Input
                  value={annotationInputs[index]?.key ?? ''}
                  onChange={(e) =>
                    setAnnotationInputs((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], key: e.target.value, value: prev[index]?.value ?? '' },
                    }))
                  }
                  placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.annotationKeyPlaceholder}
                  className="w-[80px]"
                />
                <Input
                  value={annotationInputs[index]?.value ?? ''}
                  onChange={(e) =>
                    setAnnotationInputs((prev) => ({
                      ...prev,
                      [index]: { ...prev[index], value: e.target.value, key: prev[index]?.key ?? '' },
                    }))
                  }
                  placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.annotationValuePlaceholder}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addAnnotation(index)}>
                  {ADMIN_GRAMMAR_CONTENT.form.addAnnotationLabel}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
