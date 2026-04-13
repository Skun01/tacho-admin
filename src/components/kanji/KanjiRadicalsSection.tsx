import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import type { KanjiUpsertInput } from '@/lib/validations/kanjiAdmin'

interface KanjiRadicalsSectionProps {
  form: UseFormReturn<KanjiUpsertInput>
}

export function KanjiRadicalsSection({ form }: KanjiRadicalsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'radicals',
  })

  const C = ADMIN_KANJI_CONTENT.form

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{C.sections.radicalsTitle}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ character: '', meaningVi: '' })}
        >
          <PlusIcon size={16} />
          {C.addRadicalLabel}
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {C.noRadicalsLabel}
        </p>
      )}

      {/* Hiển thị lỗi refine (duplicate character) */}
      {form.formState.errors.radicals?.root?.message && (
        <p className="text-sm text-destructive">{form.formState.errors.radicals.root.message}</p>
      )}
      {typeof form.formState.errors.radicals?.message === 'string' && (
        <p className="text-sm text-destructive">{form.formState.errors.radicals.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-start gap-3 rounded-lg p-3"
            style={{ backgroundColor: 'var(--surface-container, rgba(0, 0, 0, 0.03))' }}
          >
            <span className="mt-2 text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
              {C.sections.radicalItemLabel(index + 1)}
            </span>

            <FormField
              control={form.control}
              name={`radicals.${index}.character`}
              render={({ field: inputField }) => (
                <FormItem className="w-24">
                  <FormLabel className="text-xs">{C.fields.radicalCharacterLabel}</FormLabel>
                  <FormControl>
                    <Input
                      {...inputField}
                      placeholder={C.fields.radicalCharacterPlaceholder}
                      className="text-center text-lg font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`radicals.${index}.meaningVi`}
              render={({ field: inputField }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">{C.fields.radicalMeaningViLabel}</FormLabel>
                  <FormControl>
                    <Input
                      {...inputField}
                      placeholder={C.fields.radicalMeaningViPlaceholder}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-6 shrink-0 text-destructive hover:text-destructive"
              onClick={() => remove(index)}
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
