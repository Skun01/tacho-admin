import { useMemo, useState } from 'react'
import { FunnelSimpleIcon, MagnifyingGlassIcon, ProhibitIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import type { SentenceLevel } from '@/types/sentenceAdmin'
import { SENTENCE_LEVEL_OPTIONS } from '@/types/sentenceAdmin'

interface SentenceAdminFiltersProps {
  keywordInput: string
  levelInput?: SentenceLevel
  totalItems: number
  onKeywordInputChange: (value: string) => void
  onLevelToggle: (level: SentenceLevel) => void
  onSearch: () => void
  onReset: () => void
}

export function SentenceAdminFilters({
  keywordInput,
  levelInput,
  totalItems,
  onKeywordInputChange,
  onLevelToggle,
  onSearch,
  onReset,
}: SentenceAdminFiltersProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const isMobile = useIsMobile()

  const hasActiveFilters = useMemo(() => Boolean(keywordInput.trim() || levelInput), [keywordInput, levelInput])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (keywordInput.trim()) count += 1
    if (levelInput) count += 1
    return count
  }, [keywordInput, levelInput])

  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">{ADMIN_SENTENCE_CONTENT.levelLabel}</p>
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
          {ADMIN_SENTENCE_CONTENT.applyFilterLabel}
        </Button>
        <Button type="button" variant="outline" className={isMobile ? 'w-full' : undefined} onClick={onReset}>
          <ProhibitIcon size={16} />
          {ADMIN_SENTENCE_CONTENT.clearFilterLabel}
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
              placeholder={ADMIN_SENTENCE_CONTENT.searchPlaceholder}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch()
                }
              }}
            />
          </div>

          <Button type="button" onClick={onSearch}>
            <MagnifyingGlassIcon size={16} />
            {ADMIN_SENTENCE_CONTENT.searchLabel}
          </Button>

          {isMobile ? (
            <Drawer open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DrawerTrigger asChild>
                <Button type="button" variant={hasActiveFilters ? 'default' : 'outline'}>
                  <FunnelSimpleIcon size={16} />
                  {ADMIN_SENTENCE_CONTENT.filterButtonLabel}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{ADMIN_SENTENCE_CONTENT.filterTitle}</DrawerTitle>
                  <DrawerDescription>{ADMIN_SENTENCE_CONTENT.filterDescription}</DrawerDescription>
                </DrawerHeader>
                {filterContent}
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant={hasActiveFilters ? 'default' : 'outline'}>
                  <FunnelSimpleIcon size={16} />
                  {ADMIN_SENTENCE_CONTENT.filterButtonLabel}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                  <DialogTitle>{ADMIN_SENTENCE_CONTENT.filterTitle}</DialogTitle>
                  <DialogDescription>{ADMIN_SENTENCE_CONTENT.filterDescription}</DialogDescription>
                </DialogHeader>
                {filterContent}
              </DialogContent>
            </Dialog>
          )}

          <Button type="button" variant="outline" onClick={onReset}>
            <ProhibitIcon size={16} />
            {ADMIN_SENTENCE_CONTENT.clearFilterLabel}
          </Button>

          <Badge variant="outline">{ADMIN_SENTENCE_CONTENT.resultCountLabel(totalItems)}</Badge>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ADMIN_SENTENCE_CONTENT.activeFilterSummaryLabel(activeFilterCount)}</Badge>
            {keywordInput.trim() && (
              <Badge variant="outline">
                {ADMIN_SENTENCE_CONTENT.activeKeywordLabel}: {keywordInput.trim()}
              </Badge>
            )}
            {levelInput && (
              <Badge variant="outline">
                {ADMIN_SENTENCE_CONTENT.activeLevelLabel}: {levelInput}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}