import { useMemo, useState } from 'react'
import { FunnelSimpleIcon, MagnifyingGlassIcon, ProhibitIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import type { VocabularyLevel, VocabularyStatus } from '@/types/vocabularyAdmin'
import {
  getVocabularyStatusLabel,
  getVocabularyWordTypeLabel,
  VOCABULARY_LEVEL_OPTIONS,
  VOCABULARY_STATUS_OPTIONS,
  VOCABULARY_WORD_TYPE_OPTIONS,
} from '@/types/vocabularyAdmin'

interface VocabularyAdminFiltersProps {
  keywordInput: string
  levelInput?: VocabularyLevel
  statusInput?: VocabularyStatus
  wordTypeInput?: string
  createdByMeInput: boolean
  hasAudioInput?: boolean
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: VocabularyLevel) => void
  onStatusToggle: (status: VocabularyStatus) => void
  onWordTypeToggle: (wordType: string) => void
  onCreatedByMeChange: (value: boolean) => void
  onHasAudioChange: (value: boolean | undefined) => void
  onSearch: () => void
  onReset: () => void
}

export function VocabularyAdminFilters({
  keywordInput,
  levelInput,
  statusInput,
  wordTypeInput,
  createdByMeInput,
  hasAudioInput,
  totalItems,
  onKeywordInputChange,
  onLevelToggle,
  onStatusToggle,
  onWordTypeToggle,
  onCreatedByMeChange,
  onHasAudioChange,
  onSearch,
  onReset,
}: VocabularyAdminFiltersProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const isMobile = useIsMobile()

  const hasActiveFilters = useMemo(
    () => Boolean(keywordInput.trim() || levelInput || statusInput || wordTypeInput || createdByMeInput || hasAudioInput !== undefined),
    [keywordInput, levelInput, statusInput, wordTypeInput, createdByMeInput, hasAudioInput],
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (keywordInput.trim()) count += 1
    if (levelInput) count += 1
    if (statusInput) count += 1
    if (wordTypeInput) count += 1
    if (createdByMeInput) count += 1
    if (hasAudioInput !== undefined) count += 1
    return count
  }, [keywordInput, levelInput, statusInput, wordTypeInput, createdByMeInput, hasAudioInput])

  const filterContent = (
    <div className="space-y-4">
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
              {getVocabularyStatusLabel(status)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.wordTypeLabel}</p>
        <div className="flex flex-wrap gap-2">
          {VOCABULARY_WORD_TYPE_OPTIONS.map((wordType) => (
            <Button
              key={wordType}
              type="button"
              size="sm"
              variant={wordTypeInput === wordType ? 'default' : 'outline'}
              onClick={() => onWordTypeToggle(wordType)}
            >
              {getVocabularyWordTypeLabel(wordType)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.hasAudioLabel}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={hasAudioInput === true ? 'default' : 'outline'}
            onClick={() => onHasAudioChange(hasAudioInput === true ? undefined : true)}
          >
            {ADMIN_VOCABULARY_CONTENT.hasAudioYesLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={hasAudioInput === false ? 'default' : 'outline'}
            onClick={() => onHasAudioChange(hasAudioInput === false ? undefined : false)}
          >
            {ADMIN_VOCABULARY_CONTENT.hasAudioNoLabel}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={createdByMeInput} onCheckedChange={onCreatedByMeChange} />
        <span className="text-sm">{ADMIN_VOCABULARY_CONTENT.createdByMeLabel}</span>
        {createdByMeInput && <Badge variant="outline">{ADMIN_VOCABULARY_CONTENT.activeEnabledLabel}</Badge>}
      </div>

      <div
        className={cn(
          'flex flex-wrap gap-2',
          isMobile && 'sticky bottom-0 -mx-6 mt-2 bg-background/95 px-6 py-4 backdrop-blur-sm',
        )}
      >
        <Button
          type="button"
          className={isMobile ? 'w-full' : undefined}
          onClick={() => {
            onSearch()
            setIsFilterDialogOpen(false)
          }}
        >
          <MagnifyingGlassIcon size={16} />
          {ADMIN_VOCABULARY_CONTENT.applyFilterLabel}
        </Button>
        <Button type="button" variant="outline" className={isMobile ? 'w-full' : undefined} onClick={onReset}>
          <ProhibitIcon size={16} />
          {ADMIN_VOCABULARY_CONTENT.clearFilterLabel}
        </Button>
      </div>
    </div>
  )

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[240px] flex-1">
            <Input
              value={keywordInput}
              onChange={(event) => onKeywordInputChange(event.target.value)}
              placeholder={ADMIN_VOCABULARY_CONTENT.searchPlaceholder}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch()
                }
              }}
            />
          </div>

          <Button type="button" onClick={onSearch}>
            <MagnifyingGlassIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.searchLabel}
          </Button>

          {isMobile ? (
            <Drawer open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DrawerTrigger asChild>
                <Button type="button" variant={hasActiveFilters ? 'default' : 'outline'}>
                  <FunnelSimpleIcon size={16} />
                  {ADMIN_VOCABULARY_CONTENT.filterButtonLabel}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{ADMIN_VOCABULARY_CONTENT.filterTitle}</DrawerTitle>
                  <DrawerDescription>{ADMIN_VOCABULARY_CONTENT.filterDescription}</DrawerDescription>
                </DrawerHeader>
                {filterContent}
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant={hasActiveFilters ? 'default' : 'outline'}>
                  <FunnelSimpleIcon size={16} />
                  {ADMIN_VOCABULARY_CONTENT.filterButtonLabel}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                  <DialogTitle>{ADMIN_VOCABULARY_CONTENT.filterTitle}</DialogTitle>
                  <DialogDescription>{ADMIN_VOCABULARY_CONTENT.filterDescription}</DialogDescription>
                </DialogHeader>
                {filterContent}
              </DialogContent>
            </Dialog>
          )}

          <Button type="button" variant="outline" onClick={onReset}>
            <ProhibitIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.clearFilterLabel}
          </Button>

          <Badge variant="outline">{ADMIN_VOCABULARY_CONTENT.resultCountLabel(totalItems)}</Badge>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ADMIN_VOCABULARY_CONTENT.activeFilterSummaryLabel(activeFilterCount)}</Badge>
            {keywordInput.trim() && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeKeywordLabel}: {keywordInput.trim()}
              </Badge>
            )}
            {levelInput && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeLevelLabel}: {levelInput}
              </Badge>
            )}
            {statusInput && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeStatusLabel}: {getVocabularyStatusLabel(statusInput)}
              </Badge>
            )}
            {wordTypeInput && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeWordTypeLabel}: {getVocabularyWordTypeLabel(wordTypeInput)}
              </Badge>
            )}
            {hasAudioInput !== undefined && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeHasAudioLabel}:{' '}
                {hasAudioInput ? ADMIN_VOCABULARY_CONTENT.hasAudioYesLabel : ADMIN_VOCABULARY_CONTENT.hasAudioNoLabel}
              </Badge>
            )}
            {createdByMeInput && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.activeCreatedByMeLabel}: {ADMIN_VOCABULARY_CONTENT.activeCreatedByMeValue}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
