import { useState } from 'react'
import { Plus, MagnifyingGlass, ChatCircleDots } from '@phosphor-icons/react'
import type { CardExample, CardType } from '@/types/card'
import type { Example } from '@/types/example'
import { ExampleSearchModal } from '@/components/examples/ExampleSearchModal'
import { ExampleDetailModal } from '@/components/cards/ExampleDetailModal'
import { ExampleEditModal } from '@/components/cards/ExampleEditModal'

interface CardExamplesEditorProps {
  examples: CardExample[]
  onChange: (examples: CardExample[]) => void
  cardType?: CardType
}

const EMPTY_EXAMPLE = (): CardExample => ({
  japaneseSentence: '',
  vietnameseMeaning: '',
  position: 0,
})

function stripFurigana(text: string) {
  return text
    .replace(/\{([^|{}]+)\|[^}]+\}/g, '$1')
    .replace(/\{([^|{}]+)\}/g, '$1')
}

export function CardExamplesEditor({ examples, onChange, cardType = 'vocab' }: CardExamplesEditorProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [detailIdx, setDetailIdx] = useState<number | null>(null)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)

  const addFromLibrary = (ex: Example) => {
    onChange([
      ...examples,
      {
        japaneseSentence: ex.japaneseSentence,
        vietnameseMeaning: ex.vietnameseMeaning,
        jlptLevel: ex.jlptLevel,
        audioUrl: ex.audioUrl,
        position: examples.length,
      },
    ])
  }

  const remove = (idx: number) => {
    onChange(examples.filter((_, i) => i !== idx).map((e, i) => ({ ...e, position: i })))
  }

  const save = (draft: CardExample, idx: number) => {
    if (idx === -1) {
      onChange([...examples, { ...draft, position: examples.length }])
    } else {
      onChange(examples.map((e, i) => (i === idx ? { ...draft, position: i } : e)))
    }
    setEditingIdx(null)
  }

  const openNew = () => {
    setDetailIdx(null)
    setEditingIdx(-1)
  }

  const openEdit = (idx: number) => {
    setDetailIdx(null)
    setEditingIdx(idx)
  }

  const openDetail = (idx: number) => {
    setDetailIdx(idx)
  }

  const handleDelete = (idx: number) => {
    remove(idx)
    setDetailIdx(null)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-outline">Câu ví dụ học tập</p>
          <p className="text-[11px] text-outline mt-0.5">
            Furigana: <span style={{ fontFamily: "'Kiwi Maru', serif" }}>{'{漢字|ふりがな}'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 text-[12px] font-medium text-on-surface-variant ring-1 ring-outline-variant transition-colors hover:bg-surface-container"
          >
            <MagnifyingGlass size={13} />
            Tìm trong thư viện
          </button>
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-1.5 rounded-lg bg-primary-container px-3 py-1.5 text-[12px] font-medium text-on-primary-container transition-opacity hover:opacity-80"
          >
            <Plus size={13} weight="bold" />
            Tạo mới
          </button>
        </div>
      </div>

      {/* Empty state */}
      {examples.length === 0 && (
        <p className="py-6 text-center text-[13px] text-outline">Chưa có câu ví dụ nào</p>
      )}

      {/* Compact list */}
      <div className="space-y-2">
        {examples.map((ex, idx) => {
          const plain = stripFurigana(ex.japaneseSentence)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => openDetail(idx)}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-left transition-colors hover:bg-surface-container group"
            >
              <div className="flex items-center gap-3">
                {/* Index */}
                <span className="shrink-0 text-[11px] font-semibold text-outline w-6 text-center">
                  {idx + 1}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p
                    className="truncate text-[14px] text-on-surface"
                    style={{ fontFamily: "'Kiwi Maru', serif" }}
                  >
                    {plain || <span className="text-outline italic">Chưa có nội dung</span>}
                  </p>
                  <p className="truncate text-[12px] text-on-surface-variant">
                    {ex.vietnameseMeaning || <span className="italic text-outline">—</span>}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {ex.jlptLevel && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {ex.jlptLevel}
                    </span>
                  )}
                  {ex.hiddenPart && (
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                      Quiz
                    </span>
                  )}
                  {ex.hint && (
                    <ChatCircleDots size={13} className="text-amber-500" weight="fill" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail modal */}
      {detailIdx !== null && examples[detailIdx] && (
        <ExampleDetailModal
          example={examples[detailIdx]}
          index={detailIdx}
          cardType={cardType}
          onEdit={() => openEdit(detailIdx)}
          onDelete={() => handleDelete(detailIdx)}
          onClose={() => setDetailIdx(null)}
        />
      )}

      {/* Edit modal (create or edit) */}
      {editingIdx !== null && (
        <ExampleEditModal
          example={editingIdx === -1 ? EMPTY_EXAMPLE() : examples[editingIdx]}
          isNew={editingIdx === -1}
          cardType={cardType}
          onSave={(draft) => save(draft, editingIdx)}
          onCancel={() => setEditingIdx(null)}
        />
      )}

      {/* Library search modal */}
      {showSearch && (
        <ExampleSearchModal
          onSelect={addFromLibrary}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  )
}
