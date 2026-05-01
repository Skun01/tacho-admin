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
import {
  JLPT_EXAM_CONTENT,
  JLPT_LEVEL_LABELS,
  PUBLISH_STATUS_LABELS,
} from '@/constants/jlptAdmin'
import type { JlptLevel, PublishStatus } from '@/types/jlptAdmin'

interface JlptExamAdminFiltersProps {
  keywordInput: string
  levelInput?: JlptLevel
  statusInput?: PublishStatus
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelChange: (value?: JlptLevel) => void
  onStatusChange: (value?: PublishStatus) => void
  onSearch: () => void
  onReset: () => void
}

export function JlptExamAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  totalItems,
  onKeywordInputChange,
  onLevelChange,
  onStatusChange,
  onSearch,
  onReset,
}: JlptExamAdminFiltersProps) {
  const activeBadges: Array<{ label: string; value: string }> = []

  if (keywordInput.trim()) {
    activeBadges.push({
      label: JLPT_EXAM_CONTENT.searchLabel,
      value: keywordInput.trim(),
    })
  }

  if (levelInput) {
    activeBadges.push({
      label: JLPT_EXAM_CONTENT.columns.level,
      value: JLPT_LEVEL_LABELS[levelInput],
    })
  }

  if (statusInput) {
    activeBadges.push({
      label: JLPT_EXAM_CONTENT.columns.status,
      value: PUBLISH_STATUS_LABELS[statusInput],
    })
  }

  const activeFilterCount = [levelInput, statusInput]
    .filter((value) => value !== undefined).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keywordInput}
            onChange={(event) => onKeywordInputChange(event.target.value)}
            placeholder={JLPT_EXAM_CONTENT.searchPlaceholder}
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
              {JLPT_EXAM_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{JLPT_EXAM_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{JLPT_EXAM_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{JLPT_EXAM_CONTENT.columns.level}</label>
                <Select
                  value={levelInput ?? '__all__'}
                  onValueChange={(value) => onLevelChange(value === '__all__' ? undefined : (value as JlptLevel))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={JLPT_EXAM_CONTENT.levelFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{JLPT_EXAM_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="N5">{JLPT_LEVEL_LABELS.N5}</SelectItem>
                    <SelectItem value="N4">{JLPT_LEVEL_LABELS.N4}</SelectItem>
                    <SelectItem value="N3">{JLPT_LEVEL_LABELS.N3}</SelectItem>
                    <SelectItem value="N2">{JLPT_LEVEL_LABELS.N2}</SelectItem>
                    <SelectItem value="N1">{JLPT_LEVEL_LABELS.N1}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{JLPT_EXAM_CONTENT.columns.status}</label>
                <Select
                  value={statusInput ?? '__all__'}
                  onValueChange={(value) => onStatusChange(value === '__all__' ? undefined : (value as PublishStatus))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={JLPT_EXAM_CONTENT.statusFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{JLPT_EXAM_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="Draft">{PUBLISH_STATUS_LABELS.Draft}</SelectItem>
                    <SelectItem value="Published">{PUBLISH_STATUS_LABELS.Published}</SelectItem>
                    <SelectItem value="Archived">{PUBLISH_STATUS_LABELS.Archived}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {JLPT_EXAM_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {JLPT_EXAM_CONTENT.resetFiltersLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {JLPT_EXAM_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={`${badge.label}-${badge.value}`} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium text-muted-foreground">
            · {JLPT_EXAM_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
