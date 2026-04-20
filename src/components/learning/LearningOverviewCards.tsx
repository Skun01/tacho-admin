import {
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon,
  PencilLineIcon,
  CardsThreeIcon,
  TargetIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useLearningOverview } from '@/hooks/useLearningAdminQueries'

interface StatCardProps {
  icon: Icon
  label: string
  value: string | number
  suffix?: string
}

function StatCard({ icon: IconComponent, label, value, suffix }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--surface-container-high)' }}
        >
          <IconComponent size={22} style={{ color: 'var(--on-surface-variant)' }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--on-surface-variant)' }}>
            {label}
          </p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums" style={{ color: 'var(--on-surface)' }}>
            {value}{suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const C = ADMIN_LEARNING_CONTENT.overview

export function LearningOverviewCards() {
  const { data, isLoading } = useLearningOverview()

  if (isLoading || !data) return <OverviewSkeleton />

  const stats: StatCardProps[] = [
    { icon: UsersIcon, label: C.activeUsersTodayLabel, value: data.activeUsersToday },
    { icon: BookOpenIcon, label: C.sessionsTodayLabel, value: data.sessionsToday },
    { icon: CheckCircleIcon, label: C.completedSessionsTodayLabel, value: data.completedSessionsToday },
    { icon: PencilLineIcon, label: C.submissionsTodayLabel, value: data.submissionsToday },
    { icon: CardsThreeIcon, label: C.dueCardsNowLabel, value: data.dueCardsNow },
    { icon: TargetIcon, label: C.averageAccuracyLabel, value: data.averageAccuracy.toFixed(1), suffix: C.accuracySuffix },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  )
}
