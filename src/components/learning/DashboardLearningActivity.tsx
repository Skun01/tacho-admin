import type { Icon } from '@phosphor-icons/react'
import {
  BookOpenIcon,
  CheckCircleIcon,
  PencilLineIcon,
  CardsThreeIcon,
  TargetIcon,
} from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useLearningOverview } from '@/hooks/useLearningAdminQueries'
import type { LearningOverviewResponse } from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.overview

interface ActivityStatConfig {
  icon: Icon
  label: string
  getValue: (d: LearningOverviewResponse) => string | number
  accentColor: string
  accentBg: string
}

const ACTIVITY_ITEMS: ActivityStatConfig[] = [
  {
    icon: BookOpenIcon,
    label: C.sessionsTodayLabel,
    getValue: (d) => d.sessionsToday,
    accentColor: 'var(--primary)',
    accentBg: 'var(--primary-container)',
  },
  {
    icon: CheckCircleIcon,
    label: C.completedSessionsTodayLabel,
    getValue: (d) => d.completedSessionsToday,
    accentColor: 'var(--tertiary)',
    accentBg: 'var(--tertiary-container)',
  },
  {
    icon: PencilLineIcon,
    label: C.submissionsTodayLabel,
    getValue: (d) => d.submissionsToday,
    accentColor: 'var(--secondary)',
    accentBg: 'var(--secondary-container)',
  },
  {
    icon: CardsThreeIcon,
    label: C.dueCardsNowLabel,
    getValue: (d) => d.dueCardsNow,
    accentColor: 'var(--error)',
    accentBg: 'var(--error-container)',
  },
  {
    icon: TargetIcon,
    label: C.averageAccuracyLabel,
    getValue: (d) => `${d.averageAccuracy.toFixed(1)}${C.accuracySuffix}`,
    accentColor: 'var(--tertiary)',
    accentBg: 'var(--tertiary-container)',
  },
]

function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="mx-auto h-3 w-16" />
                <Skeleton className="mx-auto h-7 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardLearningActivity() {
  const { data, isLoading } = useLearningOverview()

  if (isLoading || !data) return <ActivitySkeleton />

  return (
    <section aria-labelledby="activity-section-title">
      <h3
        id="activity-section-title"
        className="mb-3 text-sm font-semibold uppercase tracking-wider"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {C.activitySectionTitle}
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIVITY_ITEMS.map((item) => (
          <Card key={item.label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: item.accentBg }}
                >
                  <item.icon size={20} style={{ color: item.accentColor }} />
                </div>
                <div>
                  <p
                    className="text-xs font-medium tracking-wide"
                    style={{ color: 'var(--on-surface-variant)' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-0.5 text-xl font-bold tabular-nums"
                    style={{ color: 'var(--on-surface)' }}
                  >
                    {item.getValue(data)}
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
