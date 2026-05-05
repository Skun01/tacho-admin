import type { Icon } from '@phosphor-icons/react'
import {
  UsersIcon,
  UserCircleCheckIcon,
  UserPlusIcon,
  CalendarIcon,
  BookOpenTextIcon,
  BracketsAngleIcon,
  OnigiriIcon,
  CardsIcon,
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useUserSummary, useContentSummary } from '@/hooks/useDashboardAdminQueries'

const C = ADMIN_LEARNING_CONTENT.overview

interface StatItemConfig {
  icon: Icon
  label: string
  valueKey: string
  accentColor: string
}

const USER_STATS: StatItemConfig[] = [
  { icon: UsersIcon, label: C.totalUsersLabel, valueKey: 'totalUsers', accentColor: 'var(--primary)' },
  { icon: UserCircleCheckIcon, label: C.activeUsersTodayLabel, valueKey: 'activeUsersToday', accentColor: 'var(--tertiary)' },
  { icon: UserPlusIcon, label: C.newUsersTodayLabel, valueKey: 'newUsersToday', accentColor: 'var(--tertiary)' },
  { icon: CalendarIcon, label: C.newUsersThisWeekLabel, valueKey: 'newUsersThisWeek', accentColor: 'var(--secondary)' },
]

const CONTENT_STATS: StatItemConfig[] = [
  { icon: BookOpenTextIcon, label: C.vocabularyLabel, valueKey: 'vocabularyCount', accentColor: 'var(--primary)' },
  { icon: BracketsAngleIcon, label: C.grammarLabel, valueKey: 'grammarCount', accentColor: 'var(--secondary)' },
  { icon: OnigiriIcon, label: C.kanjiLabel, valueKey: 'kanjiCount', accentColor: 'var(--tertiary)' },
  { icon: CardsIcon, label: C.decksLabel, valueKey: 'deckCount', accentColor: 'var(--primary)' },
]

interface StatCardProps {
  item: StatItemConfig
  value: number
}

function StatCard({ item, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${item.accentColor}18` }}
      >
        <item.icon size={18} style={{ color: item.accentColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate leading-tight" style={{ color: 'var(--on-surface-variant)' }}>
          {item.label}
        </p>
        <p className="text-lg font-bold tabular-nums leading-tight" style={{ color: 'var(--on-surface)' }}>
          {value.toLocaleString('vi-VN')}
        </p>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  )
}

function StatGroupSkeleton({ title }: { title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--on-surface-variant)' }}>
        {title}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="card-editorial p-4">
            <StatCardSkeleton />
          </Card>
        ))}
      </div>
    </div>
  )
}

interface StatGroupProps {
  title: string
  stats: StatItemConfig[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

function StatGroup({ title, stats, data }: StatGroupProps) {
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {title}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((item) => (
          <Card key={item.valueKey} className="card-editorial p-4">
            <StatCard item={item} value={data[item.valueKey]} />
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DashboardStatEditorial() {
  const { data: userData, isLoading: userLoading } = useUserSummary()
  const { data: contentData, isLoading: contentLoading } = useContentSummary()

  const isLoading = userLoading || contentLoading

  if (isLoading || !userData || !contentData) {
    return (
      <section>
        <div className="space-y-6">
          <StatGroupSkeleton title={C.userSectionTitle} />
          <StatGroupSkeleton title={C.contentSectionTitle} />
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="stats-editorial-title">
      <h3 id="stats-editorial-title" className="sr-only">
        {C.userSectionTitle} & {C.contentSectionTitle}
      </h3>

      <div className="space-y-6">
        <StatGroup title={C.userSectionTitle} stats={USER_STATS} data={userData} />
        <StatGroup title={C.contentSectionTitle} stats={CONTENT_STATS} data={contentData} />
      </div>
    </section>
  )
}