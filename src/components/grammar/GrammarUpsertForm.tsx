import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { XIcon } from '@phosphor-icons/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GrammarStructuresSection } from '@/components/grammar/GrammarStructuresSection'
import { GrammarRelationsSection } from '@/components/grammar/GrammarRelationsSection'
import { GrammarResourcesSection } from '@/components/grammar/GrammarResourcesSection'
import { GrammarSentencesSection } from '@/components/grammar/GrammarSentencesSection'
import { RichTextEditor } from '@/components/grammar/RichTextEditor'
import { grammarUpsertSchema, type GrammarUpsertInput } from '@/lib/validations/grammarAdmin'
import { voicevoxService } from '@/services/voicevoxService'
import { ADMIN_COMMON_CONTENT, ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import {
  GRAMMAR_LEVEL_OPTIONS,
  GRAMMAR_REGISTER_LABELS,
  GRAMMAR_REGISTER_OPTIONS,
  GRAMMAR_STATUS_LABELS,
  GRAMMAR_STATUS_OPTIONS,
} from '@/types/grammarAdmin'
import type { GrammarAdminDetail, GrammarUpsertPayload } from '@/types/grammarAdmin'

interface GrammarUpsertFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: GrammarAdminDetail | null
  isSubmitting: boolean
  isLoadingDetail?: boolean
  onSubmit: (payload: GrammarUpsertPayload) => Promise<void> | void
  onDirtyChange?: (isDirty: boolean) => void
}

const DEFAULT_VALUES: GrammarUpsertInput = {
  title: '',
  summary: '',
  level: null,
  status: 'Draft',
  tags: [],
  structures: [],
  explanation: null,
  caution: null,
  register: null,
  alternateForms: [],
  relations: [],
  resources: [],
  sentences: [],
}
const EMPTY_REGISTER_VALUE = '__empty_register__'

export function GrammarUpsertForm({
  open,
  onOpenChange,
  mode,
  initialData,
  isSubmitting,
  isLoadingDetail = false,
  onSubmit,
  onDirtyChange,
}: GrammarUpsertFormProps) {
  const form = useForm<GrammarUpsertInput>({
    resolver: zodResolver(grammarUpsertSchema) as never,
    defaultValues: DEFAULT_VALUES,
  })

  const structureFieldArray = useFieldArray({ control: form.control, name: 'structures' })
  const relationFieldArray = useFieldArray({ control: form.control, name: 'relations' })
  const resourceFieldArray = useFieldArray({ control: form.control, name: 'resources' })
  const sentenceFieldArray = useFieldArray({ control: form.control, name: 'sentences' })

  const [tagInput, setTagInput] = useState('')
  const [alternateFormInput, setAlternateFormInput] = useState('')
  const submitAsDraftRef = useRef(false)

  const { data: speakerResponse } = useQuery({
    queryKey: ['admin', 'voicevox', 'speakers'],
    queryFn: async () => {
      const { data } = await voicevoxService.getSpeakers()
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
  const speakers = speakerResponse ?? []

  // Reset form when initialData changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const normalizedLevel = GRAMMAR_LEVEL_OPTIONS.find((level) => level === initialData.level) ?? null
      const normalizedStatus = GRAMMAR_STATUS_OPTIONS.find((status) => status === initialData.status) ?? 'Draft'
      const rawRegister = initialData.register?.trim().toLowerCase()
      const normalizedRegister =
        GRAMMAR_REGISTER_OPTIONS.find((register) => register.toLowerCase() === rawRegister) ?? null

      form.reset({
        title: initialData.title,
        summary: initialData.summary,
        level: normalizedLevel,
        status: normalizedStatus,
        tags: initialData.tags ?? [],
        structures: initialData.structures?.map((s) => ({
          pattern: s.pattern,
          annotations: s.annotations,
        })) ?? [],
        explanation: initialData.explanation ?? null,
        caution: initialData.caution ?? null,
        register: normalizedRegister,
        alternateForms: initialData.alternateForms ?? [],
        relations: initialData.relations?.map((r) => ({
          relatedId: r.relatedId,
          relationType: r.relationType,
          title: r.title,
          summary: r.summary,
        })) ?? [],
        resources: initialData.resources?.map((r) => ({
          id: r.id,
          title: r.title,
          url: r.url,
        })) ?? [],
        sentences: initialData.sentences?.map((s) => ({
          id: s.id,
          text: s.text,
          meaning: s.meaning,
          speakerId: s.speakerId ?? null,
          level: s.level,
        })) ?? [],
      })
      setTagInput('')
      setAlternateFormInput('')
      return
    }

    form.reset(DEFAULT_VALUES)
    setTagInput('')
    setAlternateFormInput('')
  }, [mode, initialData, form, open])

  // Track dirty state
  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty)
  }, [form.formState.isDirty, onDirtyChange])

  const addListItem = (path: 'tags' | 'alternateForms', rawValue: string, clear: () => void) => {
    const value = rawValue.trim()
    if (!value) return

    const existing = form.getValues(path) ?? []
    if (existing.includes(value)) {
      clear()
      return
    }

    form.setValue(path, [...existing, value], { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    clear()
  }

  const removeListItem = (path: 'tags' | 'alternateForms', value: string) => {
    const existing = form.getValues(path) ?? []
    form.setValue(path, existing.filter((item) => item !== value), { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const handleSubmit = async (values: GrammarUpsertInput) => {
    const saveAsDraft = submitAsDraftRef.current
    submitAsDraftRef.current = false

    await onSubmit({
      title: values.title.trim(),
      summary: values.summary.trim(),
      level: values.level ?? null,
      status: saveAsDraft ? 'Draft' : (values.status ?? 'Draft'),
      tags: values.tags,
      structures: values.structures.map((s) => ({
        pattern: s.pattern,
        annotations: s.annotations,
      })),
      explanation: values.explanation?.trim() || null,
      caution: values.caution?.trim() || null,
      register: values.register ?? null,
      alternateForms: values.alternateForms,
      relations: values.relations.map((r) => ({
        relatedId: r.relatedId,
        relationType: r.relationType,
      })),
      resources: values.resources.map((r) => ({
        id: r.id,
        title: r.title.trim(),
        url: r.url.trim(),
      })),
      sentences: values.sentences.map((s) => ({
        id: s.id,
        text: s.text.trim(),
        meaning: s.meaning.trim(),
        speakerId: s.speakerId ?? null,
        level: s.level,
      })),
    })
  }

  const triggerDraftSubmit = () => {
    submitAsDraftRef.current = true
    void form.handleSubmit(handleSubmit, () => {
      submitAsDraftRef.current = false
    })()
  }

  if (!open) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? ADMIN_GRAMMAR_CONTENT.form.dialogTitleCreate : ADMIN_GRAMMAR_CONTENT.form.dialogTitleEdit}</CardTitle>
        <CardDescription>{ADMIN_GRAMMAR_CONTENT.form.dialogDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingDetail ? (
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_GRAMMAR_CONTENT.form.loadingDetailLabel}
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                  <TabsTrigger value="basic">{ADMIN_GRAMMAR_CONTENT.form.tabs.basic}</TabsTrigger>
                  <TabsTrigger value="structures">{ADMIN_GRAMMAR_CONTENT.form.tabs.structures}</TabsTrigger>
                  <TabsTrigger value="content">{ADMIN_GRAMMAR_CONTENT.form.tabs.content}</TabsTrigger>
                  <TabsTrigger value="relations">{ADMIN_GRAMMAR_CONTENT.form.tabs.relations}</TabsTrigger>
                  <TabsTrigger value="sentences">{ADMIN_GRAMMAR_CONTENT.form.tabs.sentences}</TabsTrigger>
                </TabsList>

                {/* Tab: Basic info */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.titleLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.titlePlaceholder} />
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
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.summaryLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.summaryPlaceholder} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.levelLabel}</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {GRAMMAR_LEVEL_OPTIONS.map((level) => (
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
                          <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.statusLabel}</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {GRAMMAR_STATUS_OPTIONS.map((status) => (
                              <Button
                                key={status}
                                type="button"
                                size="sm"
                                variant={field.value === status ? 'default' : 'outline'}
                                onClick={() => field.onChange(status)}
                              >
                                {GRAMMAR_STATUS_LABELS[status]}
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
                    name="register"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.registerLabel}</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ?? EMPTY_REGISTER_VALUE}
                            onValueChange={(value) => field.onChange(value === EMPTY_REGISTER_VALUE ? null : value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.registerPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EMPTY_REGISTER_VALUE}>{ADMIN_COMMON_CONTENT.emptyValueLabel}</SelectItem>
                              {GRAMMAR_REGISTER_OPTIONS.map((reg) => (
                                <SelectItem key={reg} value={reg}>
                                  {GRAMMAR_REGISTER_LABELS[reg]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.tagsLabel}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={tagInput}
                                placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.tagsPlaceholder}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addListItem('tags', tagInput, () => setTagInput(''))
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={() => addListItem('tags', tagInput, () => setTagInput(''))}>
                                {ADMIN_GRAMMAR_CONTENT.form.addItemLabel}
                              </Button>
                            </div>
                            {(field.value?.length ?? 0) > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((tag, index) => (
                                  <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1 pr-1">
                                    <span>{tag}</span>
                                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeListItem('tags', tag)}>
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

                  {/* Alternate Forms */}
                  <FormField
                    control={form.control}
                    name="alternateForms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.alternateFormsLabel}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={alternateFormInput}
                                placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.alternateFormsPlaceholder}
                                onChange={(e) => setAlternateFormInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addListItem('alternateForms', alternateFormInput, () => setAlternateFormInput(''))
                                  }
                                }}
                              />
                              <Button type="button" variant="outline" onClick={() => addListItem('alternateForms', alternateFormInput, () => setAlternateFormInput(''))}>
                                {ADMIN_GRAMMAR_CONTENT.form.addItemLabel}
                              </Button>
                            </div>
                            {(field.value?.length ?? 0) > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((form2, index) => (
                                  <Badge key={`${form2}-${index}`} variant="secondary" className="gap-1 pr-1">
                                    <span>{form2}</span>
                                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeListItem('alternateForms', form2)}>
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
                </TabsContent>

                {/* Tab: Structures */}
                <TabsContent value="structures" className="pt-4">
                  <GrammarStructuresSection form={form} structureFieldArray={structureFieldArray} />
                </TabsContent>

                {/* Tab: Content (explanation + caution) */}
                <TabsContent value="content" className="space-y-4 pt-4">
                  <h3 className="text-base font-semibold">{ADMIN_GRAMMAR_CONTENT.form.sections.contentTitle}</h3>

                  <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.explanationLabel}</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.explanationPlaceholder}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.cautionLabel}</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.cautionPlaceholder}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Tab: Relations + Resources */}
                <TabsContent value="relations" className="space-y-6 pt-4">
                  <GrammarRelationsSection
                    form={form}
                    relationFieldArray={relationFieldArray}
                    currentCardId={initialData?.id}
                  />

                  <GrammarResourcesSection form={form} resourceFieldArray={resourceFieldArray} />
                </TabsContent>

                {/* Tab: Sentences */}
                <TabsContent value="sentences" className="pt-4">
                  <GrammarSentencesSection
                    form={form}
                    sentenceFieldArray={sentenceFieldArray}
                    speakers={speakers}
                  />
                </TabsContent>
              </Tabs>

              {/* Sticky footer */}
              <div className="sticky bottom-[-24px] z-10 -mx-6 border-t bg-background/95 px-6 py-4 backdrop-blur-sm lg:bottom-[-32px]">
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={isSubmitting || isLoadingDetail}>
                    {mode === 'create' ? ADMIN_GRAMMAR_CONTENT.form.createActionLabel : ADMIN_GRAMMAR_CONTENT.form.updateActionLabel}
                  </Button>
                  <Button type="button" variant="outline" onClick={triggerDraftSubmit} disabled={isSubmitting || isLoadingDetail}>
                    {ADMIN_GRAMMAR_CONTENT.actions.saveDraft}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                    {ADMIN_GRAMMAR_CONTENT.form.cancelActionLabel}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
