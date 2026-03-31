import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import type { CardExample, CardType, JlptLevel } from '@/types/card'
import { JLPT_LEVELS } from '@/constants/cards'
import { ClozeSelector } from '@/components/examples/ClozeSelector'
import { useExampleStore } from '@/stores/exampleStore'

const inputCls = "rounded-lg border-0 bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"

interface MeaningSelectorProps {
  meaning: string
  visibleHint?: string
  onSelect: (part: string | undefined) => void
}

function MeaningSelector({ meaning, visibleHint, onSelect }: MeaningSelectorProps) {
  const handleMouseUp = () => {
    const sel = window.getSelection()
    const selected = sel?.toString().trim()
    if (!selected) return
    if (meaning.includes(selected)) {
      onSelect(selected)
      sel?.removeAllRanges()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-outline">
          Phần hiển thị rõ trong quiz
        </span>
        {visibleHint && (
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className="flex items-center gap-1 text-[11px] text-outline hover:text-tertiary transition-colors"
          >
            <X size={11} />
            Xoá
          </button>
        )}
      </div>
      <div
        className="cursor-text select-text rounded-lg bg-card px-3 py-2.5 text-sm leading-relaxed text-on-surface ring-1 ring-outline-variant"
        onMouseUp={handleMouseUp}
        title="Kéo chọn phần muốn hiển thị rõ"
      >
        {visibleHint && meaning.includes(visibleHint) ? (() => {
          const vi = meaning.indexOf(visibleHint)
          return (
            <>
              {vi > 0 && <span className="opacity-40">{meaning.slice(0, vi)}</span>}
              <mark className="rounded bg-secondary px-0.5 text-secondary-foreground not-italic">{visibleHint}</mark>
              {vi + visibleHint.length < meaning.length && (
                <span className="opacity-40">{meaning.slice(vi + visibleHint.length)}</span>
              )}
            </>
          )
        })() : meaning}
      </div>
      {visibleHint ? (
        <p className="text-[11px] text-on-surface-variant">
          Hiện rõ:{' '}
          <span className="rounded bg-secondary/15 px-1.5 py-0.5 text-[13px] text-secondary">
            {visibleHint}
          </span>
        </p>
      ) : (
        <p className="text-[11px] text-outline">Kéo chọn phần nghĩa muốn hiển thị rõ cho người dùng</p>
      )}
    </div>
  )
}

interface Props {
  example: CardExample
  isNew: boolean
  cardType?: CardType
  onSave: (ex: CardExample) => void
  onCancel: () => void
}

export function ExampleEditModal({ example, isNew, cardType = 'vocab', onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<CardExample>({ ...example })
  const addToLibrary = useExampleStore((s) => s.add)

  const set = <K extends keyof CardExample>(key: K, value: CardExample[K]) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'japaneseSentence') {
        const plain = (value as string)
          .replace(/\{([^|{}]+)\|[^}]+\}/g, '$1')
          .replace(/\{([^|{}]+)\}/g, '$1')
        if (next.hiddenPart && !plain.includes(next.hiddenPart)) {
          next.hiddenPart = undefined
        }
      }
      return next
    })
  }

  const handleBlurSync = () => {
    if (draft.japaneseSentence.trim() && draft.vietnameseMeaning.trim() && !draft.id) {
      const lib = addToLibrary({
        japaneseSentence: draft.japaneseSentence,
        vietnameseMeaning: draft.vietnameseMeaning,
        jlptLevel: draft.jlptLevel,
      })
      setDraft((prev) => ({ ...prev, id: lib.id }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-2xl bg-card shadow-2xl max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-[13px] font-semibold text-on-surface">
            {isNew ? 'Thêm câu ví dụ' : 'Chỉnh sửa câu ví dụ'}
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto px-5 pb-4 space-y-4">

          {/* Sentence + meaning */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Tiếng Nhật</label>
              <input
                value={draft.japaneseSentence}
                onChange={(e) => set('japaneseSentence', e.target.value)}
                onBlur={handleBlurSync}
                className={inputCls}
                placeholder="{今日|きょう}は{天気|てんき}がいいです"
                style={{ fontFamily: "'Kiwi Maru', serif" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Tiếng Việt</label>
              <input
                value={draft.vietnameseMeaning}
                onChange={(e) => set('vietnameseMeaning', e.target.value)}
                onBlur={handleBlurSync}
                className={inputCls}
                placeholder="Hôm nay thời tiết đẹp"
              />
            </div>
          </div>

          {/* Audio URL */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant">
              URL audio <span className="text-outline">(tuỳ chọn)</span>
            </label>
            <input
              value={draft.audioUrl ?? ''}
              onChange={(e) => set('audioUrl', e.target.value || undefined)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          {/* Cloze selector */}
          <ClozeSelector
            sentence={draft.japaneseSentence}
            hiddenPart={draft.hiddenPart}
            onSelect={(part) => set('hiddenPart', part)}
          />

          {/* Meaning selector (visibleHint) */}
          {draft.vietnameseMeaning && (
            <MeaningSelector
              meaning={draft.vietnameseMeaning}
              visibleHint={draft.visibleHint}
              onSelect={(part: string | undefined) => set('visibleHint', part)}
            />
          )}

          {/* Hint */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant">
              Gợi ý khi người dùng bí{' '}
              <span className="text-outline">(tuỳ chọn — hiện khi bật 💡 trong quiz)</span>
            </label>
            <input
              value={draft.hint ?? ''}
              onChange={(e) => set('hint', e.target.value || undefined)}
              className={inputCls}
              placeholder="VD: Động từ nhóm 2, chia dạng て..."
            />
          </div>

          {/* Alternative answers */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant">
              Đáp án thay thế{' '}
              <span className="text-outline">(tuỳ chọn, ngăn cách bằng dấu phẩy)</span>
            </label>
            <input
              value={draft.alternativeAnswers?.join(', ') ?? ''}
              onChange={(e) => {
                const val = e.target.value
                set('alternativeAnswers', val ? val.split(',').map((s) => s.trim()).filter(Boolean) : undefined)
              }}
              className={inputCls}
              placeholder="たべる, たべます"
            />
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-on-surface-variant">Cấp JLPT</label>
              <select
                value={draft.jlptLevel ?? ''}
                onChange={(e) => set('jlptLevel', (e.target.value as JlptLevel) || undefined)}
                className={inputCls}
              >
                <option value="">—</option>
                {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {cardType === 'grammar' && (
              <label className="flex cursor-pointer items-center gap-2 mt-3 text-[12px] text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={draft.isAboutExample ?? false}
                  onChange={(e) => set('isAboutExample', e.target.checked)}
                  className="accent-primary"
                />
                Hiển thị trong phần "Về cấu trúc"
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-outline-variant/30 px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-[12px] font-medium text-on-surface-variant ring-1 ring-outline-variant transition-colors hover:bg-surface-container-low"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded-lg bg-primary px-4 py-2 text-[12px] font-medium text-on-primary transition-opacity hover:opacity-80"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
