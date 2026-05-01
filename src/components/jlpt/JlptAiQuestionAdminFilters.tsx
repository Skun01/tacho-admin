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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AI_QUESTION_STATUS_LABELS,
  JLPT_AI_QUESTION_CONTENT,
  JLPT_LEVEL_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import type { AiQuestionStatus, JlptLevel, SectionType } from '@/types/jlptAdmin'

interface JlptAiQuestionAdminFiltersProps {
  levelInput?: JlptLevel
  sectionTypeInput?: SectionType
  statusInput?: AiQuestionStatus
  totalItems: number
  onLevelChange: (value?: JlptLevel) => void
  onSectionTypeChange: (value?: SectionType) => void
  onStatusChange: (value?: AiQuestionStatus) => void
  onSearch: () => void
  onReset: () => void
}

export function JlptAiQuestionAdminFilters({
  levelInput,
  sectionTypeInput,
  statusInput,
  totalItems,
  onLevelChange,
  onSectionTypeChange,
  onStatusChange,
  onSearch,
  onReset,
}: JlptAiQuestionAdminFiltersProps) {
  const activeBadges: Array<{ label: string; value: string }> = []

  if (levelInput) {
    activeBadges.push({
      label: JLPT_AI_QUESTION_CONTENT.columns.level,
      value: JLPT_LEVEL_LABELS[levelInput],
    })
  }

  if (sectionTypeInput) {
    activeBadges.push({
      label: JLPT_AI_QUESTION_CONTENT.columns.sectionType,
      value: SECTION_TYPE_LABELS[sectionTypeInput],
    })
  }

  if (statusInput) {
    activeBadges.push({
      label: JLPT_AI_QUESTION_CONTENT.columns.status,
      value: AI_QUESTION_STATUS_LABELS[statusInput],
    })
  }

  const activeFilterCount = [levelInput, sectionTypeInput, statusInput]
    .filter((value) => value !== undefined).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-1.5">
              <FunnelIcon size={16} />
              {JLPT_AI_QUESTION_CONTENT.filterButtonLabel}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>{JLPT_AI_QUESTION_CONTENT.filterTitle}</DialogTitle>
              <DialogDescription>{JLPT_AI_QUESTION_CONTENT.filterDescription}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{JLPT_AI_QUESTION_CONTENT.columns.level}</label>
                <Select
                  value={levelInput ?? '__all__'}
                  onValueChange={(value) => onLevelChange(value === '__all__' ? undefined : (value as JlptLevel))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={JLPT_AI_QUESTION_CONTENT.levelFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{JLPT_AI_QUESTION_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="N5">{JLPT_LEVEL_LABELS.N5}</SelectItem>
                    <SelectItem value="N4">{JLPT_LEVEL_LABELS.N4}</SelectItem>
                    <SelectItem value="N3">{JLPT_LEVEL_LABELS.N3}</SelectItem>
                    <SelectItem value="N2">{JLPT_LEVEL_LABELS.N2}</SelectItem>
                    <SelectItem value="N1">{JLPT_LEVEL_LABELS.N1}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{JLPT_AI_QUESTION_CONTENT.columns.sectionType}</label>
                <Select
                  value={sectionTypeInput ?? '__all__'}
                  onValueChange={(value) => onSectionTypeChange(value === '__all__' ? undefined : (value as SectionType))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={JLPT_AI_QUESTION_CONTENT.sectionTypeFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{JLPT_AI_QUESTION_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="Moji">{SECTION_TYPE_LABELS.Moji}</SelectItem>
                    <SelectItem value="Bunpou">{SECTION_TYPE_LABELS.Bunpou}</SelectItem>
                    <SelectItem value="Dokkai">{SECTION_TYPE_LABELS.Dokkai}</SelectItem>
                    <SelectItem value="Choukai">{SECTION_TYPE_LABELS.Choukai}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{JLPT_AI_QUESTION_CONTENT.columns.status}</label>
                <Select
                  value={statusInput ?? '__all__'}
                  onValueChange={(value) => onStatusChange(value === '__all__' ? undefined : (value as AiQuestionStatus))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={JLPT_AI_QUESTION_CONTENT.statusFilterPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{JLPT_AI_QUESTION_CONTENT.allOptionLabel}</SelectItem>
                    <SelectItem value="Pending">{AI_QUESTION_STATUS_LABELS.Pending}</SelectItem>
                    <SelectItem value="Edited">{AI_QUESTION_STATUS_LABELS.Edited}</SelectItem>
                    <SelectItem value="Approved">{AI_QUESTION_STATUS_LABELS.Approved}</SelectItem>
                    <SelectItem value="Rejected">{AI_QUESTION_STATUS_LABELS.Rejected}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={onSearch}>
          <MagnifyingGlassIcon size={16} />
          {JLPT_AI_QUESTION_CONTENT.searchLabel}
        </Button>

        <Button type="button" variant="outline" onClick={onReset}>
          <XIcon size={16} />
          {JLPT_AI_QUESTION_CONTENT.resetFiltersLabel}
        </Button>
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {JLPT_AI_QUESTION_CONTENT.activeFilterSummaryLabel(activeBadges.length)}
          </span>
          {activeBadges.map((badge) => (
            <Badge key={`${badge.label}-${badge.value}`} variant="secondary" className="text-xs">
              {badge.label}: {badge.value}
            </Badge>
          ))}
          <span className="text-xs font-medium text-muted-foreground">
            · {JLPT_AI_QUESTION_CONTENT.resultCountLabel(totalItems)}
          </span>
        </div>
      )}
    </div>
  )
}
