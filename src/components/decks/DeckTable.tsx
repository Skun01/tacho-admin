import { Link } from 'react-router'
import { PencilSimple, Trash, Cards } from '@phosphor-icons/react'
import { DECK_TYPE_LABELS } from '@/constants/decks'
import { JLPT_COLORS } from '@/constants/cards'
import type { Deck } from '@/types/deck'

interface DeckTableProps {
  items: Deck[]
  onDelete: (id: string) => void
}

export function DeckTable({ items, onDelete }: DeckTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-card">
        <p className="text-[14px] text-outline">Không tìm thấy bộ thẻ nào</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-surface-container-high">
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Tên bộ thẻ</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Loại</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">JLPT</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Số thẻ</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Hiển thị</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((deck) => (
            <tr key={deck.id} className="border-b border-surface-container-high last:border-0">
              <td className="px-5 py-3.5">
                <p className="text-[14px] font-medium text-on-surface">{deck.title}</p>
                {deck.description && (
                  <p className="mt-0.5 line-clamp-1 text-[12px] text-outline">{deck.description}</p>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-outline">
                  {DECK_TYPE_LABELS[deck.deckType]}
                </span>
              </td>
              <td className="px-5 py-3.5">
                {deck.jlptLevel ? (
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${JLPT_COLORS[deck.jlptLevel].bg} ${JLPT_COLORS[deck.jlptLevel].text}`}>
                    {deck.jlptLevel}
                  </span>
                ) : (
                  <span className="text-[13px] text-outline">—</span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-[13px] text-on-surface-variant">
                  <Cards size={14} className="text-outline" />
                  {deck.totalCards}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${deck.isPublic ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-outline'}`}>
                  {deck.isPublic ? 'Công khai' : 'Ẩn'}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                  <Link
                    to={`/decks/${deck.id}/edit`}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-primary"
                  >
                    <PencilSimple size={14} />
                  </Link>
                  <button
                    onClick={() => onDelete(deck.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
