import { MagnifyingGlassIcon, FunnelIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import {
  GRAMMAR_LEVEL_OPTIONS,
  GRAMMAR_REGISTER_LABELS,
  GRAMMAR_REGISTER_OPTIONS,
  GRAMMAR_STATUS_LABELS,
  GRAMMAR_STATUS_OPTIONS,
  type GrammarLevel,
  type GrammarRegister,
  type GrammarStatus,
} from '@/types/grammarAdmin'

interface GrammarAdminFiltersProps {
  keywordInput: string
  levelInput: GrammarLevel | undefined
  statusInput: GrammarStatus | undefined
  registerInput: GrammarRegister | undefined
  createdByMeInput: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: GrammarLevel) => void
  onStatusToggle: (status: GrammarStatus) => void
  onRegisterToggle: (register: GrammarRegister) => void
  onCreatedByMeChange: (value: boolean) => void
  onSearch: () => void
  onReset: () => void
}

export function GrammarAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  registerInput,
  createdByMeInput,
  totalItems,
  onKeywordInputChange,
  onLevelToggle,
  onStatusToggle,
  onRegisterToggle,
  onCreatedByMeChange,
  onSearch,
  onReset,
}: GrammarAdminFiltersProps) {
  const activeFilterCount = [levelInput, statusInput, registerInput, createdByMeInput || undefined].filter(Boolean).length

  const activeBadges: Array<{ label: string; value: string }> = []
  if (keywordInput.trim()) activeBadges.push({ label: ADMIN_GRAMMAR_CONTENT.activeKeywordLabel, value: keywordInput.trim() })
  if (levelInput) activeBadges.push({ label: ADMIN_GRAMMAR_CONTENT.activeLevelLabel, value: levelInput })
  if (statusInput) activeBadges.push({ label: ADMIN_GRAMMAR_CONTENT.activeStatusLabel, value: GRAMMAR_STATUS_LABELS[statusInput] })
  if (registerInput) activeBadges.push({ label: ADMIN_GRAMMAR_CONTENT.activeRegisterLabel, value: GRAMMAR_REGISTER_LABELS[registerInput] })
  if (createdByMeInput) activeBadges.push({ label: ADMIN_GRAMMAR_CONTENT.activeCreatedByMeLabel, value: ADMIN_GRAMMAR_CONTENT.activeCreatedByMeValue })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--on-surface-variant)' }} />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            placeholder={ADMIN_GRAMMAR_CONTENT.searchPlaceholder}
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
              {ADMIN_GRAMMAR_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{ADMIN_GRAMMAR_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{ADMIN_GRAMMAR_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.levelLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {GRAMMAR_LEVEL_OPTIONS.map((level) => (
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
                <label className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.statusLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {GRAMMAR_STATUS_OPTIONS.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={statusInput === status ? 'default' : 'outline'}
                      onClick={() => onStatusToggle(status)}
                    >
                      {GRAMMAR_STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.registerLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {GRAMMAR_REGISTER_OPTIONS.map((reg) => (
                    <Button
                      key={reg}
                      type="button"
                      size="sm"
                      variant={registerInput === reg ? 'default' : 'outline'}
                      onClick={() => onRegisterToggle(reg)}
                    >
                      {GRAMMAR_REGISTER_LABELS[reg]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={createdByMeInput}
                  onCheckedChange={onCreatedByMeChange}
                />
                <label className="text-sm">{ADMIN_GRAMMAR_CONTENT.createdByMeLabel}</label>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {ADMIN_GRAMMAR_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {ADMIN_GRAMMAR_CONTENT.clearFilterLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_GRAMMAR_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={badge.label} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
            · {ADMIN_GRAMMAR_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
