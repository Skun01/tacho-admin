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
        examples: examples.map((e, i) => ({
          japaneseSentence: e.japaneseSentence,
          vietnameseMeaning: e.vietnameseMeaning,
          jlptLevel: e.jlptLevel,
          audioUrl: e.audioUrl,
          hiddenPart: e.hiddenPart,
          hint: e.hint,
          visibleHint: e.visibleHint,
          alternativeAnswers: e.alternativeAnswers,
          isAboutExample: e.isAboutExample ?? false,
          position: i,
        })),
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

  const inputCls = "rounded-xl border-0 bg-surface-container-low px-3 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary transition-shadow"
  const labelCls = "text-[12px] font-semibold uppercase tracking-wide text-on-surface-variant"
  const optLabelCls = "text-[12px] font-semibold uppercase tracking-wide text-outline"
  const sectionCls = "rounded-2xl bg-card p-5 space-y-4"
  const sectionTitleCls = "text-[11px] font-bold uppercase tracking-widest text-outline"

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {rootError && (
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-tertiary-container px-4 py-3">
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-tertiary" />
          <p className="text-[13px] text-on-tertiary-container">{rootError}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 items-start">

        {/* ── LEFT COLUMN (main content) ── */}
        <div className="col-span-2 space-y-4">

          {/* Nội dung chính */}
          <section className={sectionCls}>
            <p className={sectionTitleCls}>Nội dung chính</p>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>
                Mẫu câu ngữ pháp <span className="text-tertiary normal-case tracking-normal font-normal ml-1">*</span>
              </label>
              <input
                {...register('content')}
                className={inputCls}
                placeholder="例：〜てください"
                style={{ fontFamily: "'Kiwi Maru', serif", fontSize: 18 }}
              />
              {errors.content && (
                <span className="flex items-center gap-1 text-[12px] text-tertiary">
                  <Warning size={11} weight="fill" /> {errors.content.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>
                Nghĩa tiếng Việt <span className="text-tertiary normal-case tracking-normal font-normal ml-1">*</span>
              </label>
              <input
                {...register('meaning')}
                className={inputCls}
                placeholder="Hãy làm ~"
              />
              {errors.meaning && (
                <span className="flex items-center gap-1 text-[12px] text-tertiary">
                  <Warning size={11} weight="fill" /> {errors.meaning.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={optLabelCls}>Cấu trúc đầy đủ <span className="normal-case font-normal">(tuỳ chọn)</span></label>
                <input
                  {...register('structure')}
                  className={inputCls}
                  placeholder="動詞て形 + ください"
                  style={{ fontFamily: "'Kiwi Maru', serif" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={optLabelCls}>Biến thể lịch sự hơn <span className="normal-case font-normal">(tuỳ chọn)</span></label>
                <input
                  {...register('formalVariant')}
                  className={inputCls}
                  placeholder="〜てくださいませ"
                  style={{ fontFamily: "'Kiwi Maru', serif" }}
                />
              </div>
            </div>
          </section>

          {/* Giải thích chi tiết */}
          <section className={sectionCls}>
            <p className={sectionTitleCls}>Giải thích chi tiết</p>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <label className={optLabelCls}>Nội dung giải thích <span className="normal-case font-normal">(tuỳ chọn)</span></label>
                <span className="text-[11px] text-outline">Hỗ trợ HTML</span>
              </div>
              <textarea
                {...register('aboutText')}
                rows={8}
                className={`${inputCls} resize-y`}
                placeholder="<p>Giải thích ngữ pháp...</p>"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={optLabelCls}>Ghi chú thêm <span className="normal-case font-normal">(tuỳ chọn)</span></label>
              <textarea
                {...register('notes')}
                rows={3}
                className={`${inputCls} resize-y`}
                placeholder="Chú ý đặc biệt, điểm dễ nhầm..."
              />
            </div>
          </section>

          {/* Câu ví dụ học tập */}
          <section className={sectionCls}>
            <CardExamplesEditor examples={examples} onChange={setExamples} cardType="grammar" />
          </section>
        </div>

        {/* ── RIGHT COLUMN (meta) ── */}
        <div className="col-span-1 space-y-4 sticky top-6">

          {/* Phân loại */}
          <section className={sectionCls}>
            <p className={sectionTitleCls}>Phân loại</p>

            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Cấp JLPT</label>
              <select
                {...register('jlptLevel')}
                className={inputCls}
              >
                {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={optLabelCls}>Sắc thái sử dụng <span className="normal-case font-normal">(tuỳ chọn)</span></label>
              <select
                {...register('register')}
                className={inputCls}
              >
                <option value="">— Không xác định</option>
                {(Object.entries(GRAMMAR_REGISTER_LABELS) as [GrammarRegister, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary px-4 py-3 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo thẻ'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="w-full rounded-xl px-4 py-2.5 text-[13px] font-medium text-outline transition-colors hover:bg-surface-container-low"
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
