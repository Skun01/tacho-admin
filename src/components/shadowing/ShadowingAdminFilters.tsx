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
  SHADOWING_ADMIN_CONTENT,
  SHADOWING_LEVEL_LABELS,
  SHADOWING_STATUS_LABELS,
  SHADOWING_VISIBILITY_LABELS,
} from '@/constants/shadowingAdmin'
import type { ShadowingLevel, ShadowingStatus, ShadowingVisibility } from '@/types/shadowingAdmin'

interface ShadowingAdminFiltersProps {
  keywordInput: string
  levelInput?: ShadowingLevel
  statusInput?: ShadowingStatus
  visibilityInput?: ShadowingVisibility
  isOfficialInput?: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelChange: (value?: ShadowingLevel) => void
  onStatusChange: (value?: ShadowingStatus) => void
  onVisibilityChange: (value?: ShadowingVisibility) => void
  onIsOfficialChange: (value: boolean) => void
  onSearch: () => void
  onReset: () => void
}

export function ShadowingAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  visibilityInput,
  isOfficialInput,
  totalItems,
  onKeywordInputChange,
  onLevelChange,
  onStatusChange,
  onVisibilityChange,
  onIsOfficialChange,
  onSearch,
  onReset,
}: ShadowingAdminFiltersProps) {
  const activeBadges: Array<{ label: string; value: string }> = []

  if (keywordInput.trim()) {
    activeBadges.push({
      label: SHADOWING_ADMIN_CONTENT.searchLabel,
      value: keywordInput.trim(),
    })
  }

  if (levelInput) {
    activeBadges.push({
      label: SHADOWING_ADMIN_CONTENT.columns.level,
      value: SHADOWING_LEVEL_LABELS[levelInput],
    })
  }

  if (statusInput) {
    activeBadges.push({
      label: SHADOWING_ADMIN_CONTENT.columns.status,
      value: SHADOWING_STATUS_LABELS[statusInput],
    })
  }

  if (visibilityInput) {
    activeBadges.push({
      label: SHADOWING_ADMIN_CONTENT.columns.visibility,
      value: SHADOWING_VISIBILITY_LABELS[visibilityInput],
    })
  }

  if (isOfficialInput) {
    activeBadges.push({
      label: SHADOWING_ADMIN_CONTENT.columns.official,
      value: SHADOWING_ADMIN_CONTENT.officialOnlyLabel,
    })
  }

  const activeFilterCount = [levelInput, statusInput, visibilityInput, isOfficialInput]
    .filter((value) => value !== undefined && value !== false).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            placeholder={SHADOWING_ADMIN_CONTENT.searchPlaceholder}
            className="pl-9"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onSearch()
              }
            }}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-1.5">
              <FunnelIcon size={16} />
              {SHADOWING_ADMIN_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>{SHADOWING_ADMIN_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{SHADOWING_ADMIN_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{SHADOWING_ADMIN_CONTENT.columns.level}</label>
                <Select
                  value={levelInput ?? '__all__'}
                  onValueChange={(value) => onLevelChange(value === '__all__' ? undefined : (value as ShadowingLevel))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={SHADOWING_ADMIN_CONTENT.levelFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{SHADOWING_ADMIN_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="N5">{SHADOWING_LEVEL_LABELS.N5}</SelectItem>
                    <SelectItem value="N4">{SHADOWING_LEVEL_LABELS.N4}</SelectItem>
                    <SelectItem value="N3">{SHADOWING_LEVEL_LABELS.N3}</SelectItem>
                    <SelectItem value="N2">{SHADOWING_LEVEL_LABELS.N2}</SelectItem>
                    <SelectItem value="N1">{SHADOWING_LEVEL_LABELS.N1}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{SHADOWING_ADMIN_CONTENT.columns.status}</label>
                <Select
                  value={statusInput ?? '__all__'}
                  onValueChange={(value) => onStatusChange(value === '__all__' ? undefined : (value as ShadowingStatus))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={SHADOWING_ADMIN_CONTENT.statusFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{SHADOWING_ADMIN_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="Draft">{SHADOWING_STATUS_LABELS.Draft}</SelectItem>
                    <SelectItem value="Published">{SHADOWING_STATUS_LABELS.Published}</SelectItem>
                    <SelectItem value="Archived">{SHADOWING_STATUS_LABELS.Archived}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{SHADOWING_ADMIN_CONTENT.columns.visibility}</label>
                <Select
                  value={visibilityInput ?? '__all__'}
                  onValueChange={(value) => onVisibilityChange(value === '__all__' ? undefined : (value as ShadowingVisibility))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={SHADOWING_ADMIN_CONTENT.visibilityFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{SHADOWING_ADMIN_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="Public">{SHADOWING_VISIBILITY_LABELS.Public}</SelectItem>
                    <SelectItem value="Private">{SHADOWING_VISIBILITY_LABELS.Private}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-7">
                <Switch checked={Boolean(isOfficialInput)} onCheckedChange={onIsOfficialChange} />
                <label className="text-sm">{SHADOWING_ADMIN_CONTENT.officialOnlyLabel}</label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {SHADOWING_ADMIN_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {SHADOWING_ADMIN_CONTENT.resetFiltersLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {SHADOWING_ADMIN_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={`${badge.label}-${badge.value}`} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium text-muted-foreground">
            · {SHADOWING_ADMIN_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
