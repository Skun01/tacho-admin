import { useMemo, useState } from 'react'
import {
  CaretDownIcon,
  CaretUpIcon,
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
  onEdit: (folder: DeckFolderResponse) => void
  onDelete: (folder: DeckFolderResponse) => void
  onAddCard: (folder: DeckFolderResponse) => void
  onRemoveCard: (folder: DeckFolderResponse, cardId: string) => void
  onMoveFolder: (folder: DeckFolderResponse, direction: 'up' | 'down') => void
  onMoveCard: (folder: DeckFolderResponse, cardId: string, direction: 'up' | 'down') => void
}

export function AdminDeckFolderSection({
  folder,
  searchQuery = '',
  isPending = false,
  onEdit,
  onDelete,
  onAddCard,
  onRemoveCard,
  onMoveFolder,
  onMoveCard,
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
    <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{folder.title}</h3>
            <Badge variant="outline">{ADMIN_DECK_CONTENT.folder.cardsCountLabel(folder.cardsCount)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {folder.description || ADMIN_DECK_CONTENT.folder.emptyCardsLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onMoveFolder(folder, 'up')} disabled={isPending}>
            {ADMIN_DECK_CONTENT.folder.moveUpLabel}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onMoveFolder(folder, 'down')} disabled={isPending}>
            {ADMIN_DECK_CONTENT.folder.moveDownLabel}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onAddCard(folder)} disabled={isPending}>
            <PlusIcon size={14} />
            {ADMIN_DECK_CONTENT.folder.addCardLabel}
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(folder)} disabled={isPending}>
            <PencilSimpleIcon size={16} />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onDelete(folder)} disabled={isPending}>
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {visibleCards.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              {ADMIN_DECK_CONTENT.folder.emptyCardsLabel}
            </div>
          ) : (
            visibleCards.map((item, index) => (
              <div key={item.cardId} className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{DECK_ADMIN_CARD_TYPE_LABELS[item.card.cardType]}</Badge>
                    {item.card.level && <Badge variant="secondary">{item.card.level}</Badge>}
                    <span className="truncate font-medium">{item.card.title}</span>
                  </div>
                  {item.card.summary && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.card.summary}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveCard(folder, item.cardId, 'up')}
                    disabled={isPending || index === 0}
                  >
                    {ADMIN_DECK_CONTENT.editor.moveUpLabel}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveCard(folder, item.cardId, 'down')}
                    disabled={isPending || index === visibleCards.length - 1}
                  >
                    {ADMIN_DECK_CONTENT.editor.moveDownLabel}
                  </Button>
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
