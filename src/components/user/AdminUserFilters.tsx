import { FunnelIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import type { AdminUserRole } from '@/types/adminUser'
import {
  ADMIN_USER_ROLE_LABELS,
} from '@/types/adminUser'

interface AdminUserFiltersProps {
  keywordInput: string
  roleInput?: AdminUserRole
  isActiveInput?: boolean
  isVerifiedInput?: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onRoleToggle: (role: AdminUserRole) => void
  onIsActiveToggle: (value: boolean | undefined) => void
  onIsVerifiedToggle: (value: boolean | undefined) => void
  onSearch: () => void
  onReset: () => void
}

export function AdminUserFilters({
  keywordInput,
  roleInput,
  isActiveInput,
  isVerifiedInput,
  totalItems,
  onKeywordInputChange,
  onRoleToggle,
  onIsActiveToggle,
  onIsVerifiedToggle,
  onSearch,
  onReset,
}: AdminUserFiltersProps) {
  const activeFilterCount = [roleInput, isActiveInput, isVerifiedInput].filter(Boolean).length

  const activeBadges: Array<{ label: string; value: string }> = []
  if (keywordInput.trim()) activeBadges.push({ label: ADMIN_USER_CONTENT.activeKeywordLabel, value: keywordInput.trim() })
  if (roleInput) activeBadges.push({ label: ADMIN_USER_CONTENT.activeRoleLabel, value: ADMIN_USER_ROLE_LABELS[roleInput] })
  if (isActiveInput !== undefined) {
    activeBadges.push({
      label: ADMIN_USER_CONTENT.activeStatusLabel,
      value: isActiveInput ? ADMIN_USER_CONTENT.activeIsActiveLabel : ADMIN_USER_CONTENT.activeIsInactiveLabel,
    })
  }
  if (isVerifiedInput !== undefined) {
    activeBadges.push({
      label: ADMIN_USER_CONTENT.activeVerificationLabel,
      value: isVerifiedInput ? ADMIN_USER_CONTENT.activeIsVerifiedLabel : ADMIN_USER_CONTENT.activeIsNotVerifiedLabel,
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--on-surface-variant)' }}
          />
          <Input
            value={keywordInput}
            onChange={(e) => onKeywordInputChange(e.target.value)}
            placeholder={ADMIN_USER_CONTENT.searchPlaceholder}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSearch()
              }
            }}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-1.5">
              <FunnelIcon size={16} />
              {ADMIN_USER_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>{ADMIN_USER_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{ADMIN_USER_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_USER_CONTENT.roleLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {(['user', 'editor', 'admin'] as AdminUserRole[]).map((role) => (
                    <Button
                      key={role}
                      type="button"
                      size="sm"
                      variant={roleInput === role ? 'default' : 'outline'}
                      onClick={() => onRoleToggle(role)}
                    >
                      {ADMIN_USER_ROLE_LABELS[role]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_USER_CONTENT.statusLabel}</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={isActiveInput === true ? 'default' : 'outline'}
                    onClick={() => onIsActiveToggle(isActiveInput === true ? undefined : true)}
                  >
                    {ADMIN_USER_CONTENT.isActiveLabel}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={isActiveInput === false ? 'default' : 'outline'}
                    onClick={() => onIsActiveToggle(isActiveInput === false ? undefined : false)}
                  >
                    {ADMIN_USER_CONTENT.isInactiveLabel}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{ADMIN_USER_CONTENT.isVerifiedFilterLabel}</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={isVerifiedInput === true ? 'default' : 'outline'}
                    onClick={() => onIsVerifiedToggle(isVerifiedInput === true ? undefined : true)}
                  >
                    {ADMIN_USER_CONTENT.isVerifiedLabel}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={isVerifiedInput === false ? 'default' : 'outline'}
                    onClick={() => onIsVerifiedToggle(isVerifiedInput === false ? undefined : false)}
                  >
                    {ADMIN_USER_CONTENT.isNotVerifiedLabel}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {ADMIN_USER_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {ADMIN_USER_CONTENT.clearFilterLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_USER_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={`${badge.label}-${badge.value}`} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
            · {ADMIN_USER_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}