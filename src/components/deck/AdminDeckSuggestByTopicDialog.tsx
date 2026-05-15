import { MagnifyingGlassIcon, PlusIcon, SparkleIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
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
import { useAdminDeckSuggestByTopic } from '@/hooks/useAdminDeckSuggestByTopic'
import { DECK_ADMIN_CARD_TYPE_OPTIONS, DECK_ADMIN_LEVEL_OPTIONS, type DeckCardType } from '@/types/deckAdmin'

interface AdminDeckSuggestByTopicDialogProps {
  open: boolean
  existingCardFolderMap: Record<string, string>
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onAddCard: (cardId: string) => void
  onRemoveCard: (cardId: string, folderId: string) => void
}

function getCardTypeColors(cardType: DeckCardType) {
  if (cardType === 'Vocab') {
    return 'border-emerald-200/60 bg-emerald-50/60 text-emerald-700'
  }
  if (cardType === 'Grammar') {
    return 'border-sky-200/60 bg-sky-50/60 text-sky-700'
  }
  return 'border-violet-200/60 bg-violet-50/60 text-violet-700'
}

export function AdminDeckSuggestByTopicDialog({
  open,
  existingCardFolderMap,
  isPending = false,
  onOpenChange,
  onAddCard,
  onRemoveCard,
}: AdminDeckSuggestByTopicDialogProps) {
  const [topic, setTopic] = useState('')
  const [cardType, setCardType] = useState<DeckCardType | undefined>(undefined)
  const [level, setLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1' | undefined>(undefined)
  const [page, setPage] = useState(1)

  const trimmedTopic = useDebounce(topic.trim(), 300)

  function handleTopicChange(value: string) {
    setTopic(value)
    setPage(1)
  }

  function handleCardTypeChange(value: DeckCardType | undefined) {
    setCardType(value)
    setPage(1)
  }

  function handleLevelChange(value: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | undefined) {
    setLevel(value)
    setPage(1)
  }

  const searchResult = useAdminDeckSuggestByTopic(
    {
      topic: trimmedTopic,
      cardType,
      level,
      page,
      pageSize: 20,
    },
    open && Boolean(trimmedTopic),
  )

  const items = searchResult.data?.data ?? []
  const metaData = searchResult.data?.metaData
  const totalPage = metaData ? Math.ceil(metaData.total / metaData.pageSize) : 1

  const content = ADMIN_DECK_CONTENT.suggestByTopicDialog

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[min(680px,calc(100vh-2rem))] max-w-2xl overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">{content.title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{content.description}</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="px-6 pb-4">
            <div className="relative">
              <SparkleIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                autoFocus
                value={topic}
                onChange={(event) => handleTopicChange(event.target.value)}
                placeholder={content.searchPlaceholder}
                className="h-11 rounded-xl border-border/60 bg-background pl-10 pr-10 shadow-none focus-visible:border-primary/40 focus-visible:ring-0"
              />
              {topic.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2"
                  onClick={() => handleTopicChange('')}
                  aria-label={content.clearSearchLabel}
                >
                  <XIcon size={14} />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 pb-4">
            <Select value={cardType ?? '__all__'} onValueChange={(value) => handleCardTypeChange(value === '__all__' ? undefined : (value as DeckCardType))}>
              <SelectTrigger className="h-9 w-40 rounded-lg border-border/60 bg-background shadow-none">
                <SelectValue placeholder={content.typeFilterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{content.allCardTypesLabel}</SelectItem>
                {DECK_ADMIN_CARD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {DECK_ADMIN_CARD_TYPE_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={level ?? '__all__'} onValueChange={(value) => handleLevelChange(value === '__all__' ? undefined : (value as 'N5' | 'N4' | 'N3' | 'N2' | 'N1'))}>
              <SelectTrigger className="h-9 w-32 rounded-lg border-border/60 bg-background shadow-none">
                <SelectValue placeholder={content.levelFilterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{content.allLevelsLabel}</SelectItem>
                {DECK_ADMIN_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <div className="space-y-2 pb-4">
              {!trimmedTopic ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background py-12 text-center">
                  <SparkleIcon size={24} className="text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {content.emptySearchLabel}
                  </p>
                </div>
              ) : searchResult.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-xl" />
                ))
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background py-12 text-center">
                  <MagnifyingGlassIcon size={24} className="text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {content.emptyResultLabel}
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const existingFolderId = existingCardFolderMap[item.id]
                  const isAdded = Boolean(existingFolderId)

                  return (
                    <div
                      key={item.id}
                      className="group flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3 transition-colors hover:border-border/80 hover:bg-muted/30"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`w-20 justify-center text-[11px] ${getCardTypeColors(item.cardType)}`}
                          >
                            {DECK_ADMIN_CARD_TYPE_LABELS[item.cardType]}
                          </Badge>
                          {item.level && (
                            <Badge variant="outline" className="w-10 justify-center text-[11px] border-amber-200/60 bg-amber-50/60 text-amber-700">
                              {item.level}
                            </Badge>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                            {item.summary && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.summary}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isPending}
                        onClick={() => {
                          if (isAdded && existingFolderId) {
                            onRemoveCard(item.id, existingFolderId)
                            return
                          }
                          onAddCard(item.id)
                        }}
                        variant={isAdded ? 'outline' : 'default'}
                        className={`shrink-0 rounded-lg text-xs font-medium ${
                          isAdded
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                            : ''
                        }`}
                        aria-label={isAdded ? ADMIN_DECK_CONTENT.folder.removeCardLabel : content.addLabel}
                      >
                        {isAdded ? (
                          <>
                            <TrashIcon size={13} weight="bold" />
                            <span className="ml-1.5">{ADMIN_DECK_CONTENT.folder.removeCardLabel}</span>
                          </>
                        ) : (
                          <>
                            <PlusIcon size={13} weight="bold" />
                            <span className="ml-1.5">{content.addLabel}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {trimmedTopic && items.length > 0 ? (
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg"
              >
                {content.previousPageLabel}
              </Button>
              <span className="text-sm text-muted-foreground">
                {content.pageInfoLabel(page, totalPage)}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg"
              >
                {content.nextPageLabel}
              </Button>
            </div>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="rounded-lg">
              {content.closeLabel}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end border-t border-border/60 px-6 py-3">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="rounded-lg">
              {content.closeLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
