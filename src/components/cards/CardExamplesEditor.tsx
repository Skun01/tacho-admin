import { Plus, Trash } from '@phosphor-icons/react'
import type { CardExample, JlptLevel } from '@/types/card'
import { JLPT_LEVELS } from '@/constants/cards'

interface CardExamplesEditorProps {
  examples: CardExample[]
  onChange: (examples: CardExample[]) => void
}

const EMPTY_EXAMPLE = (): CardExample => ({
  japanese: '',
  vietnamese: '',
  position: 0,
})

export function CardExamplesEditor({ examples, onChange }: CardExamplesEditorProps) {
  const add = () => {
    onChange([...examples, { ...EMPTY_EXAMPLE(), position: examples.length }])
  }

  const remove = (idx: number) => {
    onChange(examples.filter((_, i) => i !== idx).map((e, i) => ({ ...e, position: i })))
  }

  const update = <K extends keyof CardExample>(idx: number, key: K, value: CardExample[K]) => {
    onChange(examples.map((e, i) => (i === idx ? { ...e, [key]: value } : e)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-on-surface-variant">Câu ví dụ</p>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg bg-primary-container px-3 py-1.5 text-[12px] font-medium text-on-primary-container transition-opacity hover:opacity-80"
        >
          <Plus size={13} weight="bold" />
          Thêm ví dụ
        </button>
      </div>

      {examples.length === 0 && (
        <p className="text-center text-[13px] text-outline py-4">Chưa có câu ví dụ nào</p>
      )}

      {examples.map((ex, idx) => (
        <div key={idx} className="rounded-xl bg-surface-container-low p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">Ví dụ #{idx + 1}</span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
            >
              <Trash size={13} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Tiếng Nhật</label>
              <input
                value={ex.japanese}
                onChange={(e) => update(idx, 'japanese', e.target.value)}
                className="rounded-lg border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
                placeholder="例：今日は天気がいいです"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Tiếng Việt</label>
              <input
                value={ex.vietnamese}
                onChange={(e) => update(idx, 'vietnamese', e.target.value)}
                className="rounded-lg border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
                placeholder="Hôm nay thời tiết đẹp"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Cấp JLPT (tuỳ chọn)</label>
              <select
                value={ex.jlptLevel ?? ''}
                onChange={(e) => update(idx, 'jlptLevel', (e.target.value as JlptLevel) || undefined)}
                className="rounded-lg border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              >
                <option value="">—</option>
                {JLPT_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer text-[13px] text-on-surface-variant">
              <input
                type="checkbox"
                checked={ex.isAboutExample ?? false}
                onChange={(e) => update(idx, 'isAboutExample', e.target.checked)}
                className="accent-primary"
              />
              Ví dụ chính
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}
