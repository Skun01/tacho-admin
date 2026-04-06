import { MagnifyingGlassIcon, ProhibitIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { VocabularyLevel, VocabularyStatus } from '@/types/vocabularyAdmin'
import { VOCABULARY_LEVEL_OPTIONS, VOCABULARY_STATUS_OPTIONS } from '@/types/vocabularyAdmin'

interface VocabularyAdminFiltersProps {
  keywordInput: string
  levelInput?: VocabularyLevel
  statusInput?: VocabularyStatus
  createdByMeInput: boolean
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: VocabularyLevel) => void
  onStatusToggle: (status: VocabularyStatus) => void
  onCreatedByMeChange: (value: boolean) => void
  onSearch: () => void
  onReset: () => void
}

export function VocabularyAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  createdByMeInput,
  onKeywordInputChange,
  onLevelToggle,
  onStatusToggle,
  onCreatedByMeChange,
  onSearch,
  onReset,
}: VocabularyAdminFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ADMIN_VOCABULARY_CONTENT.searchLabel}</CardTitle>
        <CardDescription>{ADMIN_VOCABULARY_CONTENT.statusLabel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={keywordInput}
          onChange={(event) => onKeywordInputChange(event.target.value)}
          placeholder={ADMIN_VOCABULARY_CONTENT.searchPlaceholder}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.levelLabel}</p>
          <div className="flex flex-wrap gap-2">
            {VOCABULARY_LEVEL_OPTIONS.map((level) => (
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
          <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.statusLabel}</p>
          <div className="flex flex-wrap gap-2">
            {VOCABULARY_STATUS_OPTIONS.map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={statusInput === status ? 'default' : 'outline'}
                onClick={() => onStatusToggle(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={createdByMeInput} onCheckedChange={onCreatedByMeChange} />
          <span className="text-sm">{ADMIN_VOCABULARY_CONTENT.createdByMeLabel}</span>
          {createdByMeInput && <Badge variant="outline">Đang bật</Badge>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onSearch}>
            <MagnifyingGlassIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.searchLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            <ProhibitIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.clearFilterLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}