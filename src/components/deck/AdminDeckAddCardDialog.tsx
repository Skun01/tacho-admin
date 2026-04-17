import { MagnifyingGlassIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ADMIN_DECK_CONTENT,
  DECK_ADMIN_CARD_TYPE_LABELS,
} from '@/constants/adminDeck'
import { useAdminDeckCardSearch } from '@/hooks/useAdminDeckCardSearch'
import { DECK_ADMIN_CARD_TYPE_OPTIONS, type DeckCardType } from '@/types/deckAdmin'

interface AdminDeckAddCardDialogProps {
  open: boolean
  existingCardIds: string[]
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onAddCard: (cardId: string) => void
}

export function AdminDeckAddCardDialog({
  open,
  existingCardIds,
  isPending = false,
  onOpenChange,
      onAddCard,
}: AdminDeckAddCardDialogProps) {
  const [query, setQuery] = useState('')
  const [cardType, setCardType] = useState<DeckCardType | undefined>(undefined)

  const searchQuery = query.trim()
  const searchResult = useAdminDeckCardSearch(
    {
      q: searchQuery,
      cardType,
      page: 1,
      pageSize: 10,
    },
    open && Boolean(searchQuery),
  )

  const items = searchResult.data?.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="border-b border-[#1d1c13]/8 px-6 py-4">
          <h2 className="text-base font-bold text-foreground">{ADMIN_DECK_CONTENT.addCardDialog.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.addCardDialog.description}</p>
        </div>

        <div className="relative px-6 pt-6">
          <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border/70 bg-card px-3 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-highest dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.2)]">
            <MagnifyingGlassIcon className="shrink-0 text-muted-foreground" size={16} />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={ADMIN_DECK_CONTENT.addCardDialog.searchPlaceholder}
              className="h-11 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
            />
            {query.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setQuery('')}
                aria-label={ADMIN_DECK_CONTENT.resetFiltersLabel}
                title={ADMIN_DECK_CONTENT.resetFiltersLabel}
              >
                <XIcon size={12} />
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="rounded-xl border bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
            {ADMIN_DECK_CONTENT.addCardDialog.publishedHintLabel}
          </div>
        </div>

        <div className="px-6 pt-4">
          <Select value={cardType ?? '__all__'} onValueChange={(value) => setCardType(value === '__all__' ? undefined : (value as DeckCardType))}>
            <SelectTrigger className="h-10 rounded-xl border-0 bg-surface-container-low shadow-none focus:ring-0">
              <SelectValue placeholder={ADMIN_DECK_CONTENT.addCardDialog.typeFilterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{ADMIN_DECK_CONTENT.addCardDialog.allCardTypesLabel}</SelectItem>
              {DECK_ADMIN_CARD_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {DECK_ADMIN_CARD_TYPE_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-6 py-5">
          {!searchQuery ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground dark:bg-surface-container-high">
              {ADMIN_DECK_CONTENT.addCardDialog.emptySearchLabel}
            </div>
          ) : searchResult.isFetching ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground dark:bg-surface-container-high">
              {ADMIN_DECK_CONTENT.addCardDialog.emptyResultLabel}
            </div>
          ) : (
            items.map((item) => {
              const isAdded = existingCardIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-all hover:shadow-[0_4px_14px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:hover:shadow-[0_10px_22px_0_rgba(0,0,0,0.24)]"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{DECK_ADMIN_CARD_TYPE_LABELS[item.cardType]}</Badge>
                      {item.level && <Badge variant="outline">{item.level}</Badge>}
                      <span className="truncate text-[15px] font-semibold text-foreground">{item.title}</span>
                    </div>
                    {item.summary && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">{item.summary}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    size={isAdded ? 'sm' : 'icon-sm'}
                    disabled={isPending || isAdded}
                    onClick={() => onAddCard(item.id)}
                    variant={isAdded ? 'secondary' : 'default'}
                    className={`shrink-0 ${isAdded ? 'rounded-full px-3 text-xs font-semibold' : 'rounded-full'}`}
                  >
                    {isAdded ? ADMIN_DECK_CONTENT.addCardDialog.addedLabel : <PlusIcon size={14} weight="bold" />}
                  </Button>
                </div>
              )
            })
          )}
        </div>

        <div className="flex justify-end border-t border-[#1d1c13]/8 px-6 py-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {ADMIN_DECK_CONTENT.editor.cancelLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
