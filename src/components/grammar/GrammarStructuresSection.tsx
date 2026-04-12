import { PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
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
                  <div className="rounded-md border">
                    <Accordion type="single" collapsible className="w-full">
                    {Object.entries(annotations).map(([key, value]) => (
                      <AccordionItem key={key} value={`${index}-${key}`} className="px-3">
                        <AccordionTrigger className="py-2 hover:no-underline">
                          <div className="flex min-w-0 items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              ({key})
                            </Badge>
                            <span className="line-clamp-1 text-sm">{value}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1">
                          <Separator className="mb-2" />
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm whitespace-pre-wrap">{value}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              aria-label={ADMIN_GRAMMAR_CONTENT.form.removeAnnotationLabel}
                              onClick={() => removeAnnotation(index, key)}
                            >
                              <XIcon size={12} />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    </Accordion>
                  </div>
                )
              })()}

              {/* Add annotation row */}
              <div className="rounded-md border p-3">
                <div className="grid gap-2 md:grid-cols-[80px_1fr_auto]">
                  <Input
                    value={annotationInputs[index]?.key ?? ''}
                    onChange={(e) =>
                      setAnnotationInputs((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], key: e.target.value, value: prev[index]?.value ?? '' },
                      }))
                    }
                    placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.annotationKeyPlaceholder}
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
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => addAnnotation(index)}>
                    <PlusIcon size={14} />
                    {ADMIN_GRAMMAR_CONTENT.form.addAnnotationLabel}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
