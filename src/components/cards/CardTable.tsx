import { Link } from 'react-router'
import { PencilSimple, Trash, ArrowCounterClockwise } from '@phosphor-icons/react'
import { CARD_TYPE_LABELS, JLPT_COLORS } from '@/constants/cards'
import type { CardListItem } from '@/types/card'

interface CardTableProps {
  items: CardListItem[]
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

export function CardTable({ items, onDelete, onRestore }: CardTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-card">
        <p className="text-[14px] text-outline">Không tìm thấy thẻ nào</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-surface-container-high">
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Nội dung</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Reading</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Nghĩa</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Loại</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">JLPT</th>
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Trạng thái</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((card) => {
            const jlptStyle = JLPT_COLORS[card.jlptLevel]
            const isDeleted = !!card.deletedAt
            return (
              <tr
                key={card.id}
                className={`border-b border-surface-container-high last:border-0 ${isDeleted ? 'opacity-50' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <span
                    className="text-[15px] font-medium text-on-surface"
                    style={{ fontFamily: "'Kiwi Maru', serif" }}
                  >
                    {card.content}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-on-surface-variant">
                  {card.reading ?? '—'}
                </td>
                <td className="max-w-[200px] px-5 py-3.5 text-[13px] text-on-surface-variant">
                  <span className="line-clamp-1">{card.meaning}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-outline">
                    {CARD_TYPE_LABELS[card.type]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${jlptStyle.bg} ${jlptStyle.text}`}>
                    {card.jlptLevel}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {isDeleted ? (
                    <span className="rounded-full bg-tertiary-container px-2.5 py-0.5 text-[11px] font-medium text-on-tertiary-container">
                      Đã xóa
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[11px] font-medium text-on-primary-container">
                      Hoạt động
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    {!isDeleted && (
                      <Link
                        to={`/cards/${card.id}/edit`}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-primary"
                      >
                        <PencilSimple size={14} weight="regular" />
                      </Link>
                    )}
                    {isDeleted ? (
                      <button
                        onClick={() => onRestore(card.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-secondary"
                        title="Khôi phục"
                      >
                        <ArrowCounterClockwise size={14} weight="regular" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onDelete(card.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
                        title="Xóa"
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
