import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{ADMIN_DECK_CONTENT.addCardDialog.title}</DialogTitle>
          <DialogDescription>{ADMIN_DECK_CONTENT.addCardDialog.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
            {ADMIN_DECK_CONTENT.addCardDialog.publishedHintLabel}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="relative">
              <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ADMIN_DECK_CONTENT.addCardDialog.searchPlaceholder}
                className="pl-9"
              />
            </div>

            <Select value={cardType ?? '__all__'} onValueChange={(value) => setCardType(value === '__all__' ? undefined : (value as DeckCardType))}>
              <SelectTrigger>
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

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {!searchQuery ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                {ADMIN_DECK_CONTENT.addCardDialog.emptySearchLabel}
              </div>
            ) : searchResult.isFetching ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 rounded-xl" />
              ))
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                {ADMIN_DECK_CONTENT.addCardDialog.emptyResultLabel}
              </div>
            ) : (
              items.map((item) => {
                const isAdded = existingCardIds.includes(item.id)
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{DECK_ADMIN_CARD_TYPE_LABELS[item.cardType]}</Badge>
                        {item.level && <Badge variant="secondary">{item.level}</Badge>}
                        <span className="truncate font-medium">{item.title}</span>
                      </div>
                      {item.summary && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending || isAdded}
                      onClick={() => onAddCard(item.id)}
                    >
                      <PlusIcon size={14} />
                      {isAdded ? ADMIN_DECK_CONTENT.addCardDialog.addedLabel : ADMIN_DECK_CONTENT.addCardDialog.addLabel}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
