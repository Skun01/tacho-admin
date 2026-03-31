import { X, PencilSimple, Trash } from '@phosphor-icons/react'
import type { CardExample, CardType } from '@/types/card'

interface Props {
  example: CardExample
  index: number
  cardType?: CardType
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

function stripFurigana(text: string) {
  return text
    .replace(/\{([^|{}]+)\|[^}]+\}/g, '$1')
    .replace(/\{([^|{}]+)\}/g, '$1')
}

function QuizPreview({ ex }: { ex: CardExample }) {
  if (!ex.hiddenPart || !ex.japaneseSentence) return null
  const plain = stripFurigana(ex.japaneseSentence)
  const si = plain.indexOf(ex.hiddenPart)
  const before = si === -1 ? plain : plain.slice(0, si)
  const after  = si === -1 ? ''    : plain.slice(si + ex.hiddenPart.length)
  const vm = ex.vietnameseMeaning
  const vh = ex.visibleHint
  let parts: [string, string, string] | null = null
  if (vm && vh) {
    const ki = vm.toLowerCase().indexOf(vh.toLowerCase())
    if (ki !== -1) parts = [vm.slice(0, ki), vm.slice(ki, ki + vh.length), vm.slice(ki + vh.length)]
  }
  return (
    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container/50 px-5 py-5 space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-outline">Xem trước quiz</p>
      <p
        className="text-[26px] leading-[2.4] tracking-wide text-on-surface text-center"
        style={{ fontFamily: "'Kiwi Maru', serif" }}
      >
        {before && <span>{before}</span>}
        <span className="mx-2 inline-block min-w-[5rem] border-b-2 border-on-surface/30 align-bottom" />
        {after && <span>{after}</span>}
      </p>
      {vm && (
        <p className="text-sm text-center text-secondary cursor-default select-none">
          {parts ? (
            <>
              {parts[0] && <span className="blur-sm">{parts[0]}</span>}
              <span className="font-semibold text-foreground">{parts[1]}</span>
              {parts[2] && <span className="blur-sm">{parts[2]}</span>}
            </>
          ) : (
            <span className="blur-sm">{vm}</span>
          )}
        </p>
      )}
      {ex.hint ? (
        <p className="mx-auto max-w-sm rounded-xl bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-700 ring-1 ring-amber-200">
          {ex.hint}
        </p>
      ) : (
        <p className="text-[11px] text-center text-outline">
          💡 Chưa có gợi ý — sẽ hiện nghĩa thẻ khi bật hint
        </p>
      )}
    </div>
  )
}

export function ExampleDetailModal({ example: ex, index, cardType = 'vocab', onEdit, onDelete, onClose }: Props) {
  const plain = stripFurigana(ex.japaneseSentence)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-lg flex-col rounded-2xl bg-card shadow-2xl max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-outline">
            Ví dụ #{index + 1}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 pb-4 space-y-4">

          {/* Japanese sentence */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-outline">Tiếng Nhật</p>
            <p
              className="text-2xl leading-relaxed text-on-surface"
              style={{ fontFamily: "'Kiwi Maru', serif" }}
            >
              {plain}
            </p>
            {ex.japaneseSentence !== plain && (
              <p className="text-[12px] text-outline font-mono">{ex.japaneseSentence}</p>
            )}
          </div>

          {/* Vietnamese meaning */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-outline">Tiếng Việt</p>
            <p className="text-[15px] text-on-surface">{ex.vietnameseMeaning}</p>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            {ex.jlptLevel && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {ex.jlptLevel}
              </span>
            )}
            {ex.hiddenPart && (
              <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                Quiz: {ex.hiddenPart}
              </span>
            )}
            {ex.visibleHint && (
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] text-on-surface-variant ring-1 ring-outline-variant">
                Gợi ý rõ: {ex.visibleHint}
              </span>
            )}
            {cardType === 'grammar' && ex.isAboutExample && (
              <span className="rounded-full bg-tertiary/10 px-2.5 py-0.5 text-[11px] font-semibold text-tertiary">
                Về cấu trúc
              </span>
            )}
          </div>

          {/* Audio URL */}
          {ex.audioUrl && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-outline">Audio</p>
              <a
                href={ex.audioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-primary underline-offset-2 hover:underline break-all"
              >
                {ex.audioUrl}
              </a>
            </div>
          )}

          {/* Alternative answers */}
          {ex.alternativeAnswers && ex.alternativeAnswers.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-outline">Đáp án thay thế</p>
              <div className="flex flex-wrap gap-1.5">
                {ex.alternativeAnswers.map((a) => (
                  <span key={a} className="rounded-lg bg-surface-container px-2 py-0.5 text-[12px] text-on-surface-variant ring-1 ring-outline-variant">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quiz preview */}
          <QuizPreview ex={ex} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 px-5 py-4 shrink-0">
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
          >
            <Trash size={13} />
            Xoá
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-[12px] font-medium text-on-surface-variant ring-1 ring-outline-variant transition-colors hover:bg-surface-container-low"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12px] font-medium text-on-primary transition-opacity hover:opacity-80"
            >
              <PencilSimple size={13} />
              Sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
