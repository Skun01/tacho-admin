import { useMemo, useState } from 'react'
import {
  CaretDownIcon,
  CaretUpIcon,
  DotsSixVerticalIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ADMIN_DECK_CONTENT, DECK_ADMIN_CARD_TYPE_LABELS } from '@/constants/adminDeck'
import type { DeckFolderResponse } from '@/types/deckAdmin'

interface AdminDeckFolderSectionProps {
  folder: DeckFolderResponse
  searchQuery?: string
  isPending?: boolean
  draggable?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragOver?: (event: React.DragEvent<HTMLElement>) => void
  onDrop?: () => void
  onDragEnd?: () => void
  onEdit: (folder: DeckFolderResponse) => void
  onDelete: (folder: DeckFolderResponse) => void
  onAddCard: (folder: DeckFolderResponse) => void
  onRemoveCard: (folder: DeckFolderResponse, cardId: string) => void
  onDragCardStart?: (cardId: string) => void
  onDragCardOver?: (cardId: string) => void
  onDropCard?: (cardId: string) => void
  onDragCardEnd?: () => void
  draggedCardId?: string | null
  dragOverCardId?: string | null
}

export function AdminDeckFolderSection({
  folder,
  searchQuery = '',
  isPending = false,
  draggable = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
  onAddCard,
  onRemoveCard,
  onDragCardStart,
  onDragCardOver,
  onDropCard,
  onDragCardEnd,
  draggedCardId = null,
  dragOverCardId = null,
}: AdminDeckFolderSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const sortedCards = useMemo(() => [...folder.cards].sort((left, right) => left.position - right.position), [folder.cards])
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleCards = useMemo(() => {
    if (!normalizedQuery) return sortedCards

    return sortedCards.filter((item) =>
      [item.card.title, item.card.summary, item.card.level ?? '', item.card.alternateForms.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [normalizedQuery, sortedCards])

  return (
    <section
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex flex-col gap-3 ${isDragOver ? 'scale-[1.01]' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)] dark:bg-surface-container-high dark:shadow-[0_10px_24px_0_rgba(0,0,0,0.24)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span title={ADMIN_DECK_CONTENT.folder.moveUpLabel}>
              <DotsSixVerticalIcon
                size={16}
                className={`hidden text-muted-foreground/35 lg:block ${
                  draggable ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
              />
            </span>
            <h3 className="text-lg font-bold text-foreground">{folder.title}</h3>
            <Badge variant="outline">{ADMIN_DECK_CONTENT.folder.cardsCountLabel(folder.cardsCount)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {folder.description || ADMIN_DECK_CONTENT.folder.emptyCardsLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => onAddCard(folder)} disabled={isPending}>
            <PlusIcon size={14} />
            {ADMIN_DECK_CONTENT.folder.addCardLabel}
          </Button>
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-surface-container-high px-1.5 py-1 dark:bg-surface-container-highest">
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => onEdit(folder)} disabled={isPending} title={ADMIN_DECK_CONTENT.folder.editLabel}>
              <PencilSimpleIcon size={12} />
            </Button>
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => onDelete(folder)} disabled={isPending} title={ADMIN_DECK_CONTENT.folder.deleteLabel} className="text-muted-foreground hover:bg-rose-50 hover:text-rose-600">
              <TrashIcon size={12} />
            </Button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {visibleCards.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.22)]">
              {ADMIN_DECK_CONTENT.folder.emptyCardsLabel}
            </div>
          ) : (
            visibleCards.map((item) => (
              <div
                key={item.cardId}
                draggable={!normalizedQuery && Boolean(onDragCardStart) && !isPending}
                onDragStart={() => {
                  if (!normalizedQuery && onDragCardStart && !isPending) {
                    onDragCardStart(item.cardId)
                  }
                }}
                onDragOver={(event) => {
                  if (!normalizedQuery && onDragCardOver && !isPending) {
                    event.preventDefault()
                    onDragCardOver(item.cardId)
                  }
                }}
                onDrop={() => {
                  if (!normalizedQuery && onDropCard && !isPending) {
                    onDropCard(item.cardId)
                  }
                }}
                onDragEnd={() => {
                  if (!normalizedQuery && onDragCardEnd && !isPending) {
                    onDragCardEnd()
                  }
                }}
                className={`flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high ${
                  dragOverCardId === item.cardId && draggedCardId !== item.cardId ? 'scale-[1.01]' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!normalizedQuery && (
                      <DotsSixVerticalIcon
                        size={14}
                        className="text-muted-foreground/40"
                      />
                    )}
                    <Badge variant="outline">{DECK_ADMIN_CARD_TYPE_LABELS[item.card.cardType]}</Badge>
                    {item.card.level && <Badge variant="outline">{item.card.level}</Badge>}
                    <span className="truncate font-medium text-foreground">{item.card.title}</span>
                  </div>
                  {item.card.summary && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.card.summary}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveCard(folder, item.cardId)} disabled={isPending}>
                    {ADMIN_DECK_CONTENT.folder.removeCardLabel}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
