import { X } from '@phosphor-icons/react'

/** Strip {漢字|ふりがな} markers, returning plain display text. */
function stripFurigana(str: string): string {
  return str.replace(/\{([^|{}]+)\|[^}]+\}/g, '$1').replace(/\{([^|{}]+)\}/g, '$1')
}

/** Render sentence with the hiddenPart highlighted. */
function renderWithHighlight(sentence: string, hiddenPart: string): React.ReactNode {
  const display = stripFurigana(sentence)
  const idx = display.indexOf(hiddenPart)
  if (idx === -1) return <span>{display}</span>
  return (
    <>
      <span>{display.slice(0, idx)}</span>
      <mark className="rounded bg-primary px-0.5 text-primary-foreground not-italic">
        {hiddenPart}
      </mark>
      <span>{display.slice(idx + hiddenPart.length)}</span>
    </>
  )
}

interface ClozeSelectorProps {
  sentence: string
  hiddenPart?: string
  onSelect: (part: string | undefined) => void
}

export function ClozeSelector({ sentence, hiddenPart, onSelect }: ClozeSelectorProps) {
  const display = stripFurigana(sentence)

  const handleMouseUp = () => {
    const sel = window.getSelection()
    const selected = sel?.toString().trim()
    if (!selected) return
    if (display.includes(selected)) {
      onSelect(selected)
      sel?.removeAllRanges()
    }
  }

  if (!sentence) {
    return (
      <p className="py-1.5 text-[12px] italic text-outline">
        Nhập câu tiếng Nhật trước để chọn phần ẩn
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-outline">
          Phần bị ẩn trong quiz
        </span>
        {hiddenPart && (
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
        className="cursor-text select-text rounded-lg bg-surface-container px-3 py-2.5 font-kiwi text-sm leading-relaxed text-on-surface ring-1 ring-outline-variant"
        onMouseUp={handleMouseUp}
        title="Kéo chọn phần muốn ẩn"
      >
        {hiddenPart ? renderWithHighlight(display, hiddenPart) : display}
      </div>

      {hiddenPart ? (
        <p className="text-[11px] text-on-surface-variant">
          Ẩn:{' '}
          <span className="rounded bg-primary/15 px-1.5 py-0.5 font-kiwi text-[13px] text-primary">
            {hiddenPart}
          </span>
        </p>
      ) : (
        <p className="text-[11px] text-outline">Kéo chọn để đánh dấu phần sẽ bị ẩn</p>
      )}
    </div>
  )
}
