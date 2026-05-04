import type { Icon } from '@phosphor-icons/react'
import { BookOpenTextIcon, BracketsAngleIcon, OnigiriIcon, CardsIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useContentSummary } from '@/hooks/useDashboardAdminQueries'

const C = ADMIN_LEARNING_CONTENT.overview

interface ContentStatItemConfig {
  icon: Icon
  label: string
  valueKey: 'vocabularyCount' | 'grammarCount' | 'kanjiCount' | 'deckCount'
  accentColor: string
  accentBg: string
}

const CONTENT_STAT_ITEMS: ContentStatItemConfig[] = [
  {
    icon: BookOpenTextIcon,
    label: C.vocabularyLabel,
    valueKey: 'vocabularyCount',
    accentColor: 'var(--primary)',
    accentBg: 'var(--primary-container)',
  },
  {
    icon: BracketsAngleIcon,
    label: C.grammarLabel,
    valueKey: 'grammarCount',
    accentColor: 'var(--secondary)',
    accentBg: 'var(--secondary-container)',
  },
  {
    icon: OnigiriIcon,
    label: C.kanjiLabel,
    valueKey: 'kanjiCount',
    accentColor: 'var(--tertiary)',
    accentBg: 'var(--tertiary-container)',
  },
  {
    icon: CardsIcon,
    label: C.decksLabel,
    valueKey: 'deckCount',
    accentColor: 'var(--primary)',
    accentBg: 'var(--primary-container)',
  },
]

function ContentSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardContentSummary() {
  const { data, isLoading } = useContentSummary()

  if (isLoading || !data) return <ContentSummarySkeleton />

  return (
    <section aria-labelledby="content-summary-title">
      <h3
        id="content-summary-title"
        className="mb-3 text-sm font-semibold uppercase tracking-wider"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {C.contentSectionTitle}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTENT_STAT_ITEMS.map((item) => (
          <Card key={item.valueKey} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.accentBg }}
                >
                  <item.icon size={24} style={{ color: item.accentColor }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-medium tracking-wide"
                    style={{ color: 'var(--on-surface-variant)' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-0.5 text-2xl font-bold tabular-nums"
                    style={{ color: 'var(--on-surface)' }}
                  >
                    {data[item.valueKey].toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
