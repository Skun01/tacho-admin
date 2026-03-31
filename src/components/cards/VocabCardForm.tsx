import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PitchAccentPicker } from '@/components/ui/PitchAccentPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { Warning } from '@phosphor-icons/react'
import { CardExamplesEditor } from './CardExamplesEditor'
import { DictEntriesEditor } from './DictEntriesEditor'
import { cardService } from '@/services/cardService'
import { JLPT_LEVELS, CARD_COPY } from '@/constants/cards'
import { gooeyToast } from '@/components/ui/goey-toaster'
import type { CardExample, DictEntry, JlptLevel, VocabCard } from '@/types/card'

const schema = z.object({
  jlptLevel:          z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  content:            z.string().min(1, 'Bắt buộc'),
  reading:            z.string().min(1, 'Bắt buộc'),
  meaning:            z.string().min(1, 'Bắt buộc'),
})
type FormValues = z.infer<typeof schema>

interface VocabCardFormProps {
  initial?: VocabCard
}

export function VocabCardForm({ initial }: VocabCardFormProps) {
  const navigate = useNavigate()
  const isEdit = !!initial

  const [examples,     setExamples]     = useState<CardExample[]>(initial?.examples ?? [])
  const [dictEntries,  setDictEntries]  = useState<DictEntry[]>(initial?.dictEntries ?? [])
  const [pitchPattern, setPitchPattern] = useState<number[]>(initial?.pitchPattern ?? [])
  const [rootError,    setRootError]    = useState<string | null>(null)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jlptLevel:       initial?.jlptLevel ?? 'N5',
      content:         initial?.content ?? '',
      reading:         initial?.reading ?? '',
      meaning:         initial?.meaning ?? '',
    },
  })

  const readingValue = useWatch({ name: 'reading', control })

  const onSubmit = async (values: FormValues) => {
    setRootError(null)
    try {
      const payload = {
        jlptLevel:       values.jlptLevel as JlptLevel,
        content:         values.content,
        reading:         values.reading,
        meaning:         values.meaning,
        pitchPattern:    pitchPattern.length > 0 ? pitchPattern : undefined,
        examples: examples.map((e, i) => ({
          japaneseSentence: e.japaneseSentence,
          vietnameseMeaning: e.vietnameseMeaning,
          jlptLevel: e.jlptLevel,
          audioUrl: e.audioUrl,
          hiddenPart: e.hiddenPart,
          hint: e.hint,
          visibleHint: e.visibleHint,
          alternativeAnswers: e.alternativeAnswers,
          isAboutExample: false,
          position: i,
        })),
        dictEntries: dictEntries.map((d, i) => ({
          partOfSpeech: d.partOfSpeech,
          definitions: d.definitions.map((def) => def.definition),
          position: i,
        })),
      }

      if (isEdit && initial) {
        await cardService.updateVocab(initial.id, payload)
      } else {
        await cardService.createVocab(payload)
      }

      gooeyToast.success(isEdit ? CARD_COPY.updateSuccess : CARD_COPY.createSuccess)
      navigate('/cards')
    } catch {
      setRootError('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
  }

  const inputCls = "rounded-xl border-0 bg-surface-container-low px-3 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary transition-shadow"
  const labelCls = "text-[12px] font-semibold uppercase tracking-wide text-on-surface-variant"
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
                Từ / Kanji <span className="text-tertiary normal-case tracking-normal font-normal ml-1">*</span>
              </label>
              <input
                {...register('content')}
                className={inputCls}
                placeholder="例：食べる"
                style={{ fontFamily: "'Kiwi Maru', serif", fontSize: 18 }}
              />
              {errors.content && (
                <span className="flex items-center gap-1 text-[12px] text-tertiary">
                  <Warning size={11} weight="fill" /> {errors.content.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                  Cách đọc (Hiragana) <span className="text-tertiary normal-case tracking-normal font-normal ml-1">*</span>
                </label>
                <input
                  {...register('reading')}
                  className={inputCls}
                  placeholder="たべる"
                  style={{ fontFamily: "'Kiwi Maru', serif" }}
                />
                {errors.reading && (
                  <span className="flex items-center gap-1 text-[12px] text-tertiary">
                    <Warning size={11} weight="fill" /> {errors.reading.message}
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
                  placeholder="ăn, dùng bữa"
                />
                {errors.meaning && (
                  <span className="flex items-center gap-1 text-[12px] text-tertiary">
                    <Warning size={11} weight="fill" /> {errors.meaning.message}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Từ điển */}
          <section className={sectionCls}>
            <DictEntriesEditor entries={dictEntries} onChange={setDictEntries} />
          </section>

          {/* Câu ví dụ học tập */}
          <section className={sectionCls}>
            <CardExamplesEditor examples={examples} onChange={setExamples} />
          </section>
        </div>

        {/* ── RIGHT COLUMN (meta + technical) ── */}
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
          </section>

          {/* Phát âm */}
          <section className={sectionCls}>
            <p className={sectionTitleCls}>Phát âm</p>
            <PitchAccentPicker
              reading={readingValue ?? ''}
              pattern={pitchPattern}
              onChange={setPitchPattern}
            />
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
