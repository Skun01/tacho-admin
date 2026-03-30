import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { Warning } from '@phosphor-icons/react'
import { CardExamplesEditor } from './CardExamplesEditor'
import { cardService } from '@/services/cardService'
import { JLPT_LEVELS, GRAMMAR_REGISTER_LABELS, CARD_COPY } from '@/constants/cards'
import { gooeyToast } from '@/components/ui/goey-toaster'
import type { CardExample, GrammarCard, GrammarRegister, JlptLevel } from '@/types/card'

const schema = z.object({
  jlptLevel:     z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  content:       z.string().min(1, 'Bắt buộc'),
  meaning:       z.string().min(1, 'Bắt buộc'),
  structure:     z.string().optional(),
  formalVariant: z.string().optional(),
  register:      z.enum(['casual', 'standard', 'polite', 'formal']).optional(),
  aboutText:     z.string().optional(),
  notes:         z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface GrammarCardFormProps {
  initial?: GrammarCard
}

export function GrammarCardForm({ initial }: GrammarCardFormProps) {
  const navigate  = useNavigate()
  const isEdit    = !!initial

  const [examples, setExamples] = useState<CardExample[]>(initial?.examples ?? [])
  const [rootError, setRootError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jlptLevel:     initial?.jlptLevel ?? 'N5',
      content:       initial?.content   ?? '',
      meaning:       initial?.meaning   ?? '',
      structure:     initial?.structure     ?? '',
      formalVariant: initial?.formalVariant ?? '',
      register:      initial?.register,
      aboutText:     initial?.aboutText ?? '',
      notes:         initial?.notes     ?? '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setRootError(null)
    try {
      const payload = {
        jlptLevel:     values.jlptLevel as JlptLevel,
        content:       values.content,
        meaning:       values.meaning,
        structure:     values.structure     || undefined,
        formalVariant: values.formalVariant || undefined,
        register:      values.register as GrammarRegister | undefined,
        aboutText:     values.aboutText || undefined,
        notes:         values.notes     || undefined,
      }

      if (isEdit && initial) {
        await cardService.updateGrammar(initial.id, payload)
      } else {
        await cardService.createGrammar(payload)
      }

      gooeyToast.success(isEdit ? CARD_COPY.updateSuccess : CARD_COPY.createSuccess)
      navigate('/cards')
    } catch {
      setRootError('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {rootError && (
        <div className="flex items-start gap-2 rounded-xl bg-tertiary-container px-4 py-3">
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-tertiary" />
          <p className="text-[13px] text-on-tertiary-container">{rootError}</p>
        </div>
      )}

      {/* Core fields */}
      <section className="rounded-2xl bg-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Thông tin cơ bản
        </h3>

        <div className="grid grid-cols-2 gap-5">
          {/* JLPT Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Cấp JLPT</label>
            <select
              {...register('jlptLevel')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Register */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Văn phong (tuỳ chọn)</label>
            <select
              {...register('register')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              <option value="">—</option>
              {(Object.entries(GRAMMAR_REGISTER_LABELS) as [GrammarRegister, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Pattern */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Mẫu ngữ pháp</label>
            <input
              {...register('content')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="例：〜てください"
              style={{ fontFamily: "'Kiwi Maru', serif", fontSize: 15 }}
            />
            {errors.content && <span className="text-[12px] text-tertiary">{errors.content.message}</span>}
          </div>

          {/* Meaning */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Nghĩa (Tiếng Việt)</label>
            <input
              {...register('meaning')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="Hãy làm ~"
            />
            {errors.meaning && <span className="text-[12px] text-tertiary">{errors.meaning.message}</span>}
          </div>

          {/* Structure */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Cấu trúc (tuỳ chọn)</label>
            <input
              {...register('structure')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="動詞て形 + ください"
            />
          </div>

          {/* Formal variant */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Dạng trang trọng (tuỳ chọn)</label>
            <input
              {...register('formalVariant')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="〜てくださいませ"
            />
          </div>
        </div>
      </section>

      {/* About text */}
      <section className="rounded-2xl bg-card p-6 space-y-4">
        <h3 className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Mô tả chi tiết
        </h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-on-surface-variant">Giải thích (Markdown)</label>
          <textarea
            {...register('aboutText')}
            rows={6}
            className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary resize-y"
            placeholder="Nhập giải thích ngữ pháp (hỗ trợ Markdown)..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-on-surface-variant">Ghi chú (tuỳ chọn)</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary resize-y"
            placeholder="Chú ý đặc biệt..."
          />
        </div>
      </section>

      {/* Extra examples */}
      <section className="rounded-2xl bg-card p-6">
        <CardExamplesEditor examples={examples} onChange={setExamples} />
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/cards')}
          className="rounded-xl px-6 py-2.5 text-[13px] font-medium text-outline transition-colors hover:bg-surface-container-low"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo thẻ'}
        </button>
      </div>
    </form>
  )
}
