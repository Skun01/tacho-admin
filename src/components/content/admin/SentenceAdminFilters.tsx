import { MagnifyingGlassIcon, ProhibitIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import type { SentenceLevel } from '@/types/sentenceAdmin'
import { SENTENCE_LEVEL_OPTIONS } from '@/types/sentenceAdmin'

interface SentenceAdminFiltersProps {
  keywordInput: string
  levelInput?: SentenceLevel
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: SentenceLevel) => void
  onSearch: () => void
  onReset: () => void
}

export function SentenceAdminFilters({
  keywordInput,
  levelInput,
  onKeywordInputChange,
  onLevelToggle,
  onSearch,
  onReset,
}: SentenceAdminFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ADMIN_SENTENCE_CONTENT.searchLabel}</CardTitle>
        <CardDescription>{ADMIN_SENTENCE_CONTENT.levelLabel}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={keywordInput}
          onChange={(event) => onKeywordInputChange(event.target.value)}
          placeholder={ADMIN_SENTENCE_CONTENT.searchPlaceholder}
        />

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

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onSearch}>
            <MagnifyingGlassIcon size={16} />
            {ADMIN_SENTENCE_CONTENT.searchLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            <ProhibitIcon size={16} />
            {ADMIN_SENTENCE_CONTENT.clearFilterLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}