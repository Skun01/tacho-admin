import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlass, X, Plus } from '@phosphor-icons/react'
import type { Example } from '@/types/example'
import { JLPT_LEVELS } from '@/constants/cards'
import type { JlptLevel } from '@/types/card'
import { useExampleStore } from '@/stores/exampleStore'

/** Strip furigana markers for plain text display. */
function plain(str: string): string {
  return str.replace(/\{([^|{}]+)\|[^}]+\}/g, '$1').replace(/\{([^|{}]+)\}/g, '$1')
}

interface ExampleSearchModalProps {
  onSelect: (example: Example) => void
  onClose: () => void
}

export function ExampleSearchModal({ onSelect, onClose }: ExampleSearchModalProps) {
  const library = useExampleStore((s) => s.examples)
  const [query, setQuery]         = useState('')
  const [jlptFilter, setJlptFilter] = useState<JlptLevel | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = library.filter((ex) => {
    const matchQuery =
      !query ||
      plain(ex.japaneseSentence).includes(query) ||
      ex.vietnameseMeaning.toLowerCase().includes(query.toLowerCase())
    const matchJlpt = !jlptFilter || ex.jlptLevel === jlptFilter
    return matchQuery && matchJlpt
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex w-full max-w-xl flex-col rounded-2xl bg-card shadow-2xl overflow-hidden max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <p className="text-[14px] font-semibold text-on-surface">Tìm câu ví dụ từ thư viện</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-outline hover:bg-surface-container-low transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search + filter */}
        <div className="flex gap-2 px-4 py-3 border-b border-outline-variant/50">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo câu Nhật hoặc nghĩa Việt..."
              className="w-full rounded-xl border-0 bg-surface-container-low py-2 pl-8 pr-3 text-[13px] text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            />
          </div>
          <select
            value={jlptFilter}
            onChange={(e) => setJlptFilter(e.target.value as JlptLevel | '')}
            className="rounded-xl border-0 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          >
            <option value="">Tất cả</option>
            {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {results.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-outline">Không tìm thấy kết quả</p>
          ) : (
            results.map((ex) => (
              <div
                key={ex.id}
                className="group flex items-start gap-3 rounded-xl p-3 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] text-on-surface leading-snug"
                    style={{ fontFamily: "'Kiwi Maru', serif" }}
                  >
                    {plain(ex.japaneseSentence)}
                  </p>
                  <p className="mt-0.5 text-[12px] text-on-surface-variant">
                    {ex.vietnameseMeaning}
                  </p>
                  {ex.jlptLevel && (
                    <span className="mt-1 inline-block rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-semibold text-on-primary-container">
                      {ex.jlptLevel}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { onSelect(ex); onClose() }}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-container px-3 py-1.5 text-[12px] font-medium text-on-primary-container opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus size={11} weight="bold" />
                  Chọn
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
