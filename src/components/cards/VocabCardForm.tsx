import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
  jlptLevel:       z.enum(['N5', 'N4', 'N3', 'N2', 'N1']),
  content:         z.string().min(1, 'Bắt buộc'),
  reading:         z.string().min(1, 'Bắt buộc'),
  meaning:         z.string().min(1, 'Bắt buộc'),
  exampleSentence: z.string().optional(),
  exampleMeaning:  z.string().optional(),
  pitchAccent:     z.string().optional(),
  acceptedReadingsRaw: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface VocabCardFormProps {
  initial?: VocabCard
}

export function VocabCardForm({ initial }: VocabCardFormProps) {
  const navigate = useNavigate()
  const isEdit = !!initial

  const [examples,   setExamples]   = useState<CardExample[]>(initial?.examples ?? [])
  const [dictEntries, setDictEntries] = useState<DictEntry[]>(initial?.dictEntries ?? [])
  const [rootError,  setRootError]   = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jlptLevel:       initial?.jlptLevel ?? 'N5',
      content:         initial?.content ?? '',
      reading:         initial?.reading ?? '',
      meaning:         initial?.meaning ?? '',
      exampleSentence: initial?.exampleSentence ?? '',
      exampleMeaning:  initial?.exampleMeaning ?? '',
      pitchAccent:     initial?.pitchAccent ?? '',
      acceptedReadingsRaw: initial?.acceptedReadings?.join(', ') ?? '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setRootError(null)
    try {
      const payload = {
        jlptLevel:       values.jlptLevel as JlptLevel,
        content:         values.content,
        reading:         values.reading,
        meaning:         values.meaning,
        exampleSentence: values.exampleSentence || undefined,
        exampleMeaning:  values.exampleMeaning  || undefined,
        pitchAccent:     values.pitchAccent      || undefined,
        acceptedReadings: values.acceptedReadingsRaw
          ? values.acceptedReadingsRaw.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
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

          {/* Pitch accent */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Pitch Accent (tuỳ chọn)</label>
            <input
              {...register('pitchAccent')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="0, 1, 2..."
            />
          </div>

          {/* Content / Kanji */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Nội dung (Kanji/Kana)</label>
            <input
              {...register('content')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="例：食べる"
              style={{ fontFamily: "'Kiwi Maru', serif", fontSize: 16 }}
            />
            {errors.content && <span className="text-[12px] text-tertiary">{errors.content.message}</span>}
          </div>

          {/* Reading / Furigana */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Reading (Furigana)</label>
            <input
              {...register('reading')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="たべる"
            />
            {errors.reading && <span className="text-[12px] text-tertiary">{errors.reading.message}</span>}
          </div>

          {/* Meaning */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Nghĩa (Tiếng Việt)</label>
            <input
              {...register('meaning')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="ăn"
            />
            {errors.meaning && <span className="text-[12px] text-tertiary">{errors.meaning.message}</span>}
          </div>

          {/* Accepted readings */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Readings chấp nhận (cách nhau bằng dấu phẩy)</label>
            <input
              {...register('acceptedReadingsRaw')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="たべる, たべます"
            />
          </div>
        </div>
      </section>

      {/* Example sentence */}
      <section className="rounded-2xl bg-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Câu ví dụ mẫu
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Tiếng Nhật</label>
            <input
              {...register('exampleSentence')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="例文"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-on-surface-variant">Tiếng Việt</label>
            <input
              {...register('exampleMeaning')}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              placeholder="Nghĩa câu ví dụ"
            />
          </div>
        </div>
      </section>

      {/* Dict entries */}
      <section className="rounded-2xl bg-card p-6">
        <DictEntriesEditor entries={dictEntries} onChange={setDictEntries} />
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
