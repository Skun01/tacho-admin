import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  ADMIN_DECK_CONTENT,
  DECK_ADMIN_STATUS_LABELS,
  DECK_ADMIN_VISIBILITY_LABELS,
} from '@/constants/adminDeck'
import {
  DECK_ADMIN_STATUS_OPTIONS,
  DECK_ADMIN_VISIBILITY_OPTIONS,
  type AdminDeckTypeResponse,
  type DeckStatus,
  type DeckVisibility,
} from '@/types/deckAdmin'

interface AdminDeckFiltersProps {
  keywordInput: string
  statusInput?: DeckStatus
  visibilityInput?: DeckVisibility
  typeIdInput?: string
  isOfficialInput: boolean
  deckTypes: AdminDeckTypeResponse[]
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onStatusChange: (value?: DeckStatus) => void
  onVisibilityChange: (value?: DeckVisibility) => void
  onTypeIdChange: (value?: string) => void
  onIsOfficialChange: (value: boolean) => void
  onSearch: () => void
  onReset: () => void
}

export function AdminDeckFilters({
  keywordInput,
  statusInput,
  visibilityInput,
  typeIdInput,
  isOfficialInput,
  deckTypes,
  totalItems,
  onKeywordInputChange,
  onStatusChange,
  onVisibilityChange,
  onTypeIdChange,
  onIsOfficialChange,
  onSearch,
  onReset,
}: AdminDeckFiltersProps) {
  const activeBadges: string[] = []
  if (keywordInput.trim()) activeBadges.push(keywordInput.trim())
  if (statusInput) activeBadges.push(DECK_ADMIN_STATUS_LABELS[statusInput])
  if (visibilityInput) activeBadges.push(DECK_ADMIN_VISIBILITY_LABELS[visibilityInput])
  if (typeIdInput) {
    const activeType = deckTypes.find((item) => item.id === typeIdInput)
    if (activeType) activeBadges.push(activeType.name)
  }
  if (isOfficialInput) activeBadges.push(ADMIN_DECK_CONTENT.officialOnlyLabel)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onSearch()
              }
            }}
            placeholder={ADMIN_DECK_CONTENT.searchPlaceholder}
            className="pl-9"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-1.5">
              <FunnelIcon size={16} />
              {ADMIN_DECK_CONTENT.filterTitle}
              {activeBadges.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeBadges.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>{ADMIN_DECK_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{ADMIN_DECK_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_DECK_CONTENT.columns.status}</label>
                <Select value={statusInput ?? '__all__'} onValueChange={(value) => onStatusChange(value === '__all__' ? undefined : (value as DeckStatus))}>
                  <SelectTrigger>
                    <SelectValue placeholder={ADMIN_DECK_CONTENT.statusFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{ADMIN_DECK_CONTENT.allOptionLabel}</SelectItem>
                    {DECK_ADMIN_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {DECK_ADMIN_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_DECK_CONTENT.columns.visibility}</label>
                <Select
                  value={visibilityInput ?? '__all__'}
                  onValueChange={(value) => onVisibilityChange(value === '__all__' ? undefined : (value as DeckVisibility))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={ADMIN_DECK_CONTENT.visibilityFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{ADMIN_DECK_CONTENT.allOptionLabel}</SelectItem>
                    {DECK_ADMIN_VISIBILITY_OPTIONS.map((visibility) => (
                      <SelectItem key={visibility} value={visibility}>
                        {DECK_ADMIN_VISIBILITY_LABELS[visibility]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{ADMIN_DECK_CONTENT.columns.type}</label>
                <Select value={typeIdInput ?? '__all__'} onValueChange={(value) => onTypeIdChange(value === '__all__' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={ADMIN_DECK_CONTENT.typeFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{ADMIN_DECK_CONTENT.allOptionLabel}</SelectItem>
                    {deckTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <Switch checked={isOfficialInput} onCheckedChange={onIsOfficialChange} />
                <label className="text-sm">{ADMIN_DECK_CONTENT.officialOnlyLabel}</label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {ADMIN_DECK_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {ADMIN_DECK_CONTENT.resetFiltersLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{ADMIN_DECK_CONTENT.activeFilterSummaryLabel(activeBadges.length)}</span>
          {activeBadges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
          <span className="text-xs font-medium text-muted-foreground">· {ADMIN_DECK_CONTENT.resultCountLabel(totalItems)}</span>
        </div>
      )}
    </div>
  )
}
