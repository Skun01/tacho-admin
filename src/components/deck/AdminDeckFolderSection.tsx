import { useMemo, useState } from 'react'
import {
  CaretDownIcon,
  CaretUpIcon,
  DotsSixVerticalIcon,
  PencilSimpleIcon,
  PlusIcon,
  SparkleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ADMIN_DECK_CONTENT, DECK_ADMIN_CARD_TYPE_LABELS } from '@/constants/adminDeck'
import type { DeckFolderResponse } from '@/types/deckAdmin'

function getCardTypeColors(cardType: string) {
  if (cardType === 'Vocab') {
    return 'border-emerald-200/60 bg-emerald-50/60 text-emerald-700'
  }
  if (cardType === 'Grammar') {
    return 'border-sky-200/60 bg-sky-50/60 text-sky-700'
  }
  return 'border-violet-200/60 bg-violet-50/60 text-violet-700'
}

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
  onSuggestByTopic: (folder: DeckFolderResponse) => void
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
  onSuggestByTopic,
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
      className={`flex flex-col gap-2 ${isDragOver ? 'scale-[1.01]' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-[0_1px_4px_0_rgba(29,28,19,0.04)] dark:bg-surface-container-high dark:shadow-[0_2px_8px_0_rgba(0,0,0,0.14)]">
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
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => onSuggestByTopic(folder)} disabled={isPending}>
            <SparkleIcon size={14} />
            {ADMIN_DECK_CONTENT.folder.suggestByTopicLabel}
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" onClick={() => onEdit(folder)} disabled={isPending} title={ADMIN_DECK_CONTENT.folder.editLabel}>
            <PencilSimpleIcon size={14} style={{ color: '#92400e' }} />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" onClick={() => onDelete(folder)} disabled={isPending} title={ADMIN_DECK_CONTENT.folder.deleteLabel}>
            <TrashIcon size={14} style={{ color: '#b91c1c' }} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {visibleCards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-background px-4 py-6 text-center text-sm text-muted-foreground dark:bg-surface-container-high">
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
                className={`group flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3 transition-all hover:border-border/80 hover:shadow-[0_2px_8px_0_rgba(29,28,19,0.08)] dark:hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.15)] ${
                  dragOverCardId === item.cardId && draggedCardId !== item.cardId ? 'border-primary/40 bg-primary/5' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    {!normalizedQuery && (
                      <DotsSixVerticalIcon
                        size={14}
                        className="text-muted-foreground/40 shrink-0"
                      />
                    )}
                    <Badge variant="outline" className={`shrink-0 text-[11px] ${getCardTypeColors(item.card.cardType)}`}>
                      {DECK_ADMIN_CARD_TYPE_LABELS[item.card.cardType]}
                    </Badge>
                    {item.card.level && (
                      <Badge variant="outline" className="shrink-0 text-[11px] border-amber-200/60 bg-amber-50/60 text-amber-700">
                        {item.card.level}
                      </Badge>
                    )}
                    <span className="truncate text-sm font-medium text-foreground">{item.card.title}</span>
                  </div>
                  {item.card.summary && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.card.summary}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => onRemoveCard(folder, item.cardId)}
                  disabled={isPending}
                  title={ADMIN_DECK_CONTENT.folder.removeCardLabel}
                >
                  <TrashIcon size={14} style={{ color: '#b91c1c' }} />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
