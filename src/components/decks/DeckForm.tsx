import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { Warning } from '@phosphor-icons/react'
import { useState } from 'react'
import { deckService } from '@/services/deckService'
import { JLPT_LEVELS } from '@/constants/cards'
import { DECK_TYPE_LABELS, DECK_COPY } from '@/constants/decks'
import { gooeyToast } from '@/components/ui/goey-toaster'
import type { Deck, DeckType } from '@/types/deck'
import type { JlptLevel } from '@/types/card'

const schema = z.object({
  title:       z.string().min(1, 'Bắt buộc'),
  description: z.string().optional(),
  deckType:    z.enum(['app', 'textbook']),
  jlptLevel:   z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
  isPublic:    z.boolean(),
})
type FormValues = z.infer<typeof schema>

interface DeckFormProps {
  initial?: Deck
}

export function DeckForm({ initial }: DeckFormProps) {
  const navigate  = useNavigate()
  const isEdit    = !!initial
  const [rootError, setRootError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       initial?.title       ?? '',
      description: initial?.description ?? '',
      deckType:    initial?.deckType    ?? 'app',
      jlptLevel:   initial?.jlptLevel,
      isPublic:    initial?.isPublic    ?? true,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setRootError(null)
    try {
      const payload = {
        title:       values.title,
        description: values.description || undefined,
        deckType:    values.deckType as DeckType,
        jlptLevel:   values.jlptLevel as JlptLevel | undefined,
        isPublic:    values.isPublic,
      }
      if (isEdit && initial) {
        await deckService.update(initial.id, payload)
      } else {
        await deckService.create(payload)
      }
      gooeyToast.success(isEdit ? DECK_COPY.updateSuccess : DECK_COPY.createSuccess)
      navigate('/decks')
    } catch {
      setRootError('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {rootError && (
        <div className="flex items-start gap-2 rounded-xl bg-tertiary-container px-4 py-3">
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-tertiary" />
          <p className="text-[13px] text-on-tertiary-container">{rootError}</p>
        </div>
      )}

      <section className="rounded-2xl bg-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Thông tin bộ thẻ
        </h3>

        <div className="grid grid-cols-2 gap-5">
          {/* Deck type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Loại bộ thẻ</label>
            <select
              {...register('deckType')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              {(Object.entries(DECK_TYPE_LABELS) as [DeckType, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* JLPT level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Cấp JLPT (tuỳ chọn)</label>
            <select
              {...register('jlptLevel')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              <option value="">—</option>
              {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Title */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Tên bộ thẻ</label>
            <input
              {...register('title')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="Ví dụ: Từ vựng N5 cơ bản"
            />
            {errors.title && <span className="text-[12px] text-tertiary">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Mô tả (tuỳ chọn)</label>
            <textarea
              {...register('description')}
              rows={3}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary resize-y"
              placeholder="Mô tả ngắn về bộ thẻ..."
            />
          </div>

          {/* Public toggle */}
          <div className="col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register('isPublic')}
                className="accent-primary h-4 w-4"
              />
              <div>
                <p className="text-[13px] font-medium text-on-surface">Công khai</p>
                <p className="text-[12px] text-outline">Người dùng có thể xem và học bộ thẻ này</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/decks')}
          className="rounded-xl px-6 py-2.5 text-[13px] font-medium text-outline transition-colors hover:bg-surface-container-low"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo bộ thẻ'}
        </button>
      </div>
    </form>
  )
}
