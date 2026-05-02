import type { Icon } from '@phosphor-icons/react'
import { BookOpenTextIcon, BracketsAngleIcon, CardsIcon, OnigiriIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useAdminDashboardStats } from '@/hooks/useAdminDashboardStats'

interface StatItem {
  icon: Icon
  label: string
  value: number
}

export function DashboardStatsCards() {
  const stats = useAdminDashboardStats()

  if (stats.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-5">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const C = ADMIN_LEARNING_CONTENT.overview
  const items: StatItem[] = [
    { icon: BookOpenTextIcon, label: C.vocabularyLabel, value: stats.vocabularyCount },
    { icon: BracketsAngleIcon, label: C.grammarLabel, value: stats.grammarCount },
    { icon: OnigiriIcon, label: C.kanjiLabel, value: stats.kanjiCount },
    { icon: CardsIcon, label: C.decksLabel, value: stats.deckCount },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--surface-container-high)' }}
            >
              <item.icon size={20} style={{ color: 'var(--on-surface-variant)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
                {item.label}
              </p>
              <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--on-surface)' }}>
                {item.value.toLocaleString('vi-VN')}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}