import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import type { GrammarUpsertInput } from '@/lib/validations/grammarAdmin'

interface GrammarResourcesSectionProps {
  form: UseFormReturn<GrammarUpsertInput>
  resourceFieldArray: UseFieldArrayReturn<GrammarUpsertInput, 'resources'>
}

export function GrammarResourcesSection({ form, resourceFieldArray }: GrammarResourcesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.form.sections.resourcesTitle}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => resourceFieldArray.append({ title: '', url: '' })}
        >
          <PlusIcon size={14} />
          {ADMIN_GRAMMAR_CONTENT.form.addResourceLabel}
        </Button>
      </div>

      {resourceFieldArray.fields.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_GRAMMAR_CONTENT.form.noResourcesLabel}
        </p>
      )}

      {resourceFieldArray.fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">
              {ADMIN_GRAMMAR_CONTENT.form.sections.resourceItemLabel(index + 1)}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => resourceFieldArray.remove(index)}
            >
              <TrashIcon size={14} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <FormField
              control={form.control}
              name={`resources.${index}.title`}
              render={({ field: titleField }) => (
                <FormItem>
                  <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.resourceTitleLabel}</FormLabel>
                  <FormControl>
                    <Input {...titleField} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.resourceTitlePlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`resources.${index}.url`}
              render={({ field: urlField }) => (
                <FormItem>
                  <FormLabel>{ADMIN_GRAMMAR_CONTENT.form.fields.resourceUrlLabel}</FormLabel>
                  <FormControl>
                    <Input {...urlField} placeholder={ADMIN_GRAMMAR_CONTENT.form.fields.resourceUrlPlaceholder} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
