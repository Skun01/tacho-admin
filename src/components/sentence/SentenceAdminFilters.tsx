import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import type { SentenceLevel } from '@/types/sentenceAdmin'
import { SENTENCE_LEVEL_OPTIONS } from '@/types/sentenceAdmin'

interface SentenceAdminFiltersProps {
  keywordInput: string
  levelInput?: SentenceLevel
  createdByMeInput: boolean
  hasAudioInput?: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: SentenceLevel) => void
  onCreatedByMeChange: (value: boolean) => void
  onHasAudioChange: (value: boolean | undefined) => void
  onSearch: () => void
  onReset: () => void
}

export function SentenceAdminFilters({
  keywordInput,
  levelInput,
  createdByMeInput,
  hasAudioInput,
  totalItems,
  onKeywordInputChange,
  onLevelToggle,
  onCreatedByMeChange,
  onHasAudioChange,
  onSearch,
  onReset,
}: SentenceAdminFiltersProps) {
  const activeFilterCount = [levelInput, createdByMeInput || undefined, hasAudioInput].filter(
    (value) => value !== undefined && value !== false,
  ).length

  const activeBadges: Array<{ label: string; value: string }> = []
  if (keywordInput.trim()) activeBadges.push({ label: ADMIN_SENTENCE_CONTENT.activeKeywordLabel, value: keywordInput.trim() })
  if (levelInput) activeBadges.push({ label: ADMIN_SENTENCE_CONTENT.activeLevelLabel, value: levelInput })
  if (hasAudioInput !== undefined) {
    activeBadges.push({
      label: ADMIN_SENTENCE_CONTENT.activeHasAudioLabel,
      value: hasAudioInput ? ADMIN_SENTENCE_CONTENT.hasAudioYesLabel : ADMIN_SENTENCE_CONTENT.hasAudioNoLabel,
    })
  }
  if (createdByMeInput) {
    activeBadges.push({
      label: ADMIN_SENTENCE_CONTENT.activeCreatedByMeLabel,
      value: ADMIN_SENTENCE_CONTENT.activeCreatedByMeValue,
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--on-surface-variant)' }} />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            placeholder={ADMIN_SENTENCE_CONTENT.searchPlaceholder}
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
              {ADMIN_SENTENCE_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{ADMIN_SENTENCE_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{ADMIN_SENTENCE_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_SENTENCE_CONTENT.levelLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {SENTENCE_LEVEL_OPTIONS.map((level) => (
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
                <label className="text-sm font-medium">{ADMIN_SENTENCE_CONTENT.hasAudioLabel}</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={hasAudioInput === true ? 'default' : 'outline'}
                    onClick={() => onHasAudioChange(hasAudioInput === true ? undefined : true)}
                  >
                    {ADMIN_SENTENCE_CONTENT.hasAudioYesLabel}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={hasAudioInput === false ? 'default' : 'outline'}
                    onClick={() => onHasAudioChange(hasAudioInput === false ? undefined : false)}
                  >
                    {ADMIN_SENTENCE_CONTENT.hasAudioNoLabel}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={createdByMeInput} onCheckedChange={onCreatedByMeChange} />
                <label className="text-sm">{ADMIN_SENTENCE_CONTENT.createdByMeLabel}</label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {ADMIN_SENTENCE_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {ADMIN_SENTENCE_CONTENT.clearFilterLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_SENTENCE_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={`${badge.label}-${badge.value}`} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
            · {ADMIN_SENTENCE_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
