import { InfoIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import type { Editor } from '@tiptap/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { RichTextEditor } from '@/components/grammar/RichTextEditor'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'
import { useRef, useState } from 'react'

interface GrammarStructuresSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  structureFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'structures'>
}

export function GrammarStructuresSection({ form, structureFieldArray }: GrammarStructuresSectionProps) {
  const [annotationSelectedTexts, setAnnotationSelectedTexts] = useState<Record<number, Record<string, string>>>({})
  const [annotationErrors, setAnnotationErrors] = useState<Record<number, string | null>>({})
  const structureEditorsRef = useRef<Record<number, Editor | null>>({})

  const structures = form.watch('structures')

  const updateAnnotationValue = (structureIndex: number, key: string, value: string) => {
    const path = `structures.${structureIndex}.annotations` as const
    const existing = form.getValues(path) ?? {}

    form.setValue(
      path,
      { ...existing, [key]: value },
      { shouldValidate: true, shouldDirty: true },
    )
  }

  const extractUsedAnnotationNumbers = (pattern: string) =>
    Array.from(pattern.matchAll(/\((\d+)\)/g), ([, marker]) => Number(marker)).filter((marker) => Number.isFinite(marker))

  const getNextAnnotationNumber = (pattern: string) => {
    const usedNumbers = extractUsedAnnotationNumbers(pattern)
    let next = 1

    while (usedNumbers.includes(next)) {
      next += 1
    }

    return String(next)
  }

  const findMarkerRangeInEditor = (editor: Editor, marker: string) => {
    let accumulatedText = ''
    let matchedRange: { from: number; to: number } | null = null

    editor.state.doc.descendants((node, pos) => {
      if (!node.isText || matchedRange) return !matchedRange

      const nodeText = node.text ?? ''
      const startIndex = accumulatedText.length
      const markerIndex = `${accumulatedText}${nodeText}`.indexOf(marker)

      if (markerIndex >= startIndex) {
        const relativeIndex = markerIndex - startIndex
        matchedRange = {
          from: pos + relativeIndex,
          to: pos + relativeIndex + marker.length,
        }
        return false
      }

      accumulatedText += nodeText
      return true
    })

    return matchedRange
  }

  const inferAnnotationAnchor = (pattern: string, key: string) => {
    const markerRegex = new RegExp(`([^\\s()]+)\\(${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`)
    const match = pattern.match(markerRegex)

    return match?.[1] ?? null
  }

  const addAnnotationFromSelection = (structureIndex: number) => {
    const editor = structureEditorsRef.current[structureIndex]
    if (!editor) return

    const { from, to, empty } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ').trim()

    if (empty || !selectedText) {
      setAnnotationErrors((prev) => ({
        ...prev,
        [structureIndex]: ADMIN_GRAMMAR_CONTENT.form.fields.annotationMissingSelectionLabel,
      }))
      return
    }

    const patternPath = `structures.${structureIndex}.pattern` as const
    const annotationPath = `structures.${structureIndex}.annotations` as const
    const currentPattern = form.getValues(patternPath) ?? ''
    const nextKey = getNextAnnotationNumber(currentPattern)
    const marker = `(${nextKey})`
    const existing = form.getValues(annotationPath) ?? {}

    editor.chain().focus().insertContentAt(to, marker).run()

    form.setValue(
      annotationPath,
      { ...existing, [nextKey]: '' },
      { shouldValidate: true, shouldDirty: true, shouldTouch: true },
    )
    setAnnotationSelectedTexts((prev) => ({
      ...prev,
      [structureIndex]: {
        ...prev[structureIndex],
        [nextKey]: selectedText,
      },
    }))
    setAnnotationErrors((prev) => ({ ...prev, [structureIndex]: null }))
  }

  const removeAnnotation = (structureIndex: number, key: string) => {
    const path = `structures.${structureIndex}.annotations` as const
    const existing = form.getValues(path) ?? {}
    const { [key]: _, ...rest } = existing
    const editor = structureEditorsRef.current[structureIndex]
    const marker = `(${key})`

    if (editor) {
      const markerRange = findMarkerRangeInEditor(editor, marker)
      if (markerRange) {
        editor.chain().focus().deleteRange(markerRange).run()
      }
    }

    form.setValue(
      path,
      Object.keys(rest).length > 0 ? rest : null,
      { shouldValidate: true, shouldDirty: true },
    )
    setAnnotationSelectedTexts((prev) => {
      const structureAnchors = prev[structureIndex]
      if (!structureAnchors) return prev

      const { [key]: __, ...restAnchors } = structureAnchors
      return {
        ...prev,
        [structureIndex]: restAnchors,
      }
    })
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
                      onEditorReady={(editor) => {
                        structureEditorsRef.current[index] = editor
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Annotations */}
            <div className="space-y-2">
              <div
                className="rounded-md border p-3 text-sm"
                style={{ borderColor: 'var(--outline-variant)', background: 'var(--surface-container-low)' }}
              >
                <div className="flex items-start gap-2">
                  <InfoIcon size={16} className="mt-0.5 shrink-0" />
                  <p style={{ color: 'var(--on-surface-variant)' }}>
                    {ADMIN_GRAMMAR_CONTENT.form.fields.annotationSelectionHint}
                  </p>
                </div>
              </div>

              <div className="flex justify-start">
                <Button type="button" variant="outline" size="sm" onClick={() => addAnnotationFromSelection(index)}>
                  <PlusIcon size={14} />
                  {ADMIN_GRAMMAR_CONTENT.form.addAnnotationLabel}
                </Button>
              </div>

              {annotationErrors[index] && (
                <p className="text-sm text-destructive">{annotationErrors[index]}</p>
              )}

              {(() => {
                const annotations = structures?.[index]?.annotations
                const pattern = structures?.[index]?.pattern ?? ''

                if (!annotations || Object.keys(annotations).length === 0) {
                  return (
                    <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                      {ADMIN_GRAMMAR_CONTENT.form.fields.annotationEmptyLabel}
                    </p>
                  )
                }

                return (
                  <div className="space-y-3">
                    {Object.entries(annotations).map(([key, value]) => {
                      const selectedText =
                        annotationSelectedTexts[index]?.[key]
                        ?? inferAnnotationAnchor(pattern, key)
                      const markerExists = pattern.includes(`(${key})`)

                      return (
                        <div key={key} className="rounded-md border p-3 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  ({key})
                                </Badge>
                                <span className="text-sm font-medium">
                                  {ADMIN_GRAMMAR_CONTENT.form.fields.annotationSelectedTextLabel}
                                </span>
                                <span className="text-sm truncate" style={{ color: 'var(--on-surface-variant)' }}>
                                  {selectedText ?? `#${key}`}
                                </span>
                              </div>
                              {!markerExists && (
                                <p className="text-sm text-destructive">
                                  {ADMIN_GRAMMAR_CONTENT.form.fields.annotationMissingMarkerLabel}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              aria-label={ADMIN_GRAMMAR_CONTENT.form.removeAnnotationLabel}
                              onClick={() => removeAnnotation(index, key)}
                            >
                              <XIcon size={12} />
                            </Button>
                          </div>

                          <Input
                            value={value}
                            onChange={(event) => updateAnnotationValue(index, key, event.target.value)}
                            placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.annotationValuePlaceholder}
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
