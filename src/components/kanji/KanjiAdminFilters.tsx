import { MagnifyingGlassIcon, FunnelIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import {
  KANJI_LEVEL_OPTIONS,
  KANJI_STATUS_LABELS,
  KANJI_STATUS_OPTIONS,
  type KanjiLevel,
  type KanjiStatus,
} from '@/types/kanjiAdmin'

interface KanjiAdminFiltersProps {
  keywordInput: string
  levelInput: KanjiLevel | undefined
  statusInput: KanjiStatus | undefined
  strokeCountMinInput: number | undefined
  strokeCountMaxInput: number | undefined
  radicalInput: string
  createdByMeInput: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: KanjiLevel) => void
  onStatusToggle: (status: KanjiStatus) => void
  onStrokeCountMinChange: (value: number | undefined) => void
  onStrokeCountMaxChange: (value: number | undefined) => void
  onRadicalInputChange: (value: string) => void
  onCreatedByMeChange: (value: boolean) => void
  onSearch: () => void
  onReset: () => void
}

export function KanjiAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  strokeCountMinInput,
  strokeCountMaxInput,
  radicalInput,
  createdByMeInput,
  totalItems,
  onKeywordInputChange,
  onLevelToggle,
  onStatusToggle,
  onStrokeCountMinChange,
  onStrokeCountMaxChange,
  onRadicalInputChange,
  onCreatedByMeChange,
  onSearch,
  onReset,
}: KanjiAdminFiltersProps) {
  const activeFilterCount = [
    levelInput,
    statusInput,
    strokeCountMinInput,
    strokeCountMaxInput,
    radicalInput.trim() || undefined,
    createdByMeInput || undefined,
  ].filter(Boolean).length

  const activeBadges: Array<{ label: string; value: string }> = []
  if (keywordInput.trim()) activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeKeywordLabel, value: keywordInput.trim() })
  if (levelInput) activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeLevelLabel, value: levelInput })
  if (statusInput) activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeStatusLabel, value: KANJI_STATUS_LABELS[statusInput] })
  if (strokeCountMinInput || strokeCountMaxInput) {
    const rangeValue = [strokeCountMinInput ?? '…', strokeCountMaxInput ?? '…'].join(' – ')
    activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeStrokeCountLabel, value: rangeValue })
  }
  if (radicalInput.trim()) activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeRadicalLabel, value: radicalInput.trim() })
  if (createdByMeInput) activeBadges.push({ label: ADMIN_KANJI_CONTENT.activeCreatedByMeLabel, value: ADMIN_KANJI_CONTENT.activeCreatedByMeValue })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--on-surface-variant)' }} />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            placeholder={ADMIN_KANJI_CONTENT.searchPlaceholder}
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
              {ADMIN_KANJI_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{ADMIN_KANJI_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{ADMIN_KANJI_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_KANJI_CONTENT.levelLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {KANJI_LEVEL_OPTIONS.map((level) => (
                    <Button
                      key={level}
                      type="button"
                      size="sm"
                      variant={levelInput === level ? 'default' : 'outline'}
                      onClick={() => onLevelToggle(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_KANJI_CONTENT.statusLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {KANJI_STATUS_OPTIONS.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={statusInput === status ? 'default' : 'outline'}
                      onClick={() => onStatusToggle(status)}
                    >
                      {KANJI_STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_KANJI_CONTENT.strokeCountLabel}</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder={ADMIN_KANJI_CONTENT.strokeCountMinPlaceholder}
                    value={strokeCountMinInput ?? ''}
                    onChange={(e) => onStrokeCountMinChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-28"
                  />
                  <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>–</span>
                  <Input
                    type="number"
                    min={1}
                    placeholder={ADMIN_KANJI_CONTENT.strokeCountMaxPlaceholder}
                    value={strokeCountMaxInput ?? ''}
                    onChange={(e) => onStrokeCountMaxChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-28"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_KANJI_CONTENT.radicalFilterLabel}</label>
                <Input
                  value={radicalInput}
                  onChange={(e) => onRadicalInputChange(e.target.value)}
                  placeholder={ADMIN_KANJI_CONTENT.radicalFilterPlaceholder}
                  className="w-40"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={createdByMeInput}
                  onCheckedChange={onCreatedByMeChange}
                />
                <label className="text-sm">{ADMIN_KANJI_CONTENT.createdByMeLabel}</label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {ADMIN_KANJI_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {ADMIN_KANJI_CONTENT.clearFilterLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_KANJI_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={badge.label} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
            · {ADMIN_KANJI_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
