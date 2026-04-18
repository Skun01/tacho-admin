import { MagnifyingGlassIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
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
  existingCardFolderMap: Record<string, string>
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onAddCard: (cardId: string) => void
  onRemoveCard: (cardId: string, folderId: string) => void
}

function getCardTypeClassName(cardType: DeckCardType) {
  if (cardType === 'Vocab') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (cardType === 'Grammar') {
    return 'border-sky-200 bg-sky-50 text-sky-700'
  }

  return 'border-violet-200 bg-violet-50 text-violet-700'
}

function getLevelClassName() {
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

export function AdminDeckAddCardDialog({
  open,
  existingCardFolderMap,
  isPending = false,
  onOpenChange,
  onAddCard,
  onRemoveCard,
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
      <DialogContent className="h-[min(720px,calc(100vh-2rem))] max-w-3xl overflow-hidden p-0">
        <div className="border-b border-[#1d1c13]/8 px-6 py-4">
          <h2 className="text-base font-bold text-foreground">{ADMIN_DECK_CONTENT.addCardDialog.title}</h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative px-6 pt-6">
            <div className="flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card px-4 shadow-[0_1px_8px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.24)]">
              <MagnifyingGlassIcon className="shrink-0 text-muted-foreground" size={14} />
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
                  aria-label={ADMIN_DECK_CONTENT.addCardDialog.clearSearchLabel}
                  title={ADMIN_DECK_CONTENT.addCardDialog.clearSearchLabel}
                >
                  <XIcon size={12} />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 px-6 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="sm:w-52">
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
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-3">
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
                  const existingFolderId = existingCardFolderMap[item.id]
                  const isAdded = Boolean(existingFolderId)

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-all hover:shadow-[0_4px_14px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:hover:shadow-[0_10px_22px_0_rgba(0,0,0,0.24)]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`w-20 justify-center ${getCardTypeClassName(item.cardType)}`}
                          >
                            {DECK_ADMIN_CARD_TYPE_LABELS[item.cardType]}
                          </Badge>
                          {item.level && (
                            <Badge
                              variant="outline"
                              className={`w-11 justify-center ${getLevelClassName()}`}
                            >
                              {item.level}
                            </Badge>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-semibold text-foreground">{item.title}</span>
                            {item.summary && (
                              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.summary}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="icon-sm"
                        disabled={isPending}
                        onClick={() => {
                          if (isAdded && existingFolderId) {
                            onRemoveCard(item.id, existingFolderId)
                            return
                          }

                          onAddCard(item.id)
                        }}
                        variant={isAdded ? 'secondary' : 'default'}
                        className="shrink-0 rounded-full"
                        aria-label={isAdded ? ADMIN_DECK_CONTENT.folder.removeCardLabel : ADMIN_DECK_CONTENT.addCardDialog.addLabel}
                        title={isAdded ? ADMIN_DECK_CONTENT.folder.removeCardLabel : ADMIN_DECK_CONTENT.addCardDialog.addLabel}
                      >
                        {isAdded ? <TrashIcon size={14} weight="bold" /> : <PlusIcon size={14} weight="bold" />}
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#1d1c13]/8 px-6 py-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {ADMIN_DECK_CONTENT.addCardDialog.closeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
