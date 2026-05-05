import { useLearningOverview } from '@/hooks/useLearningAdminQueries'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import {
  MonitorPlayIcon,
  CheckCircleIcon,
  PaperPlaneTiltIcon,
  TargetIcon,
  CardsIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

const C = ADMIN_LEARNING_CONTENT.overview

// ─── Accent color tokens ────────────────────────────────────────────────────
// Each card gets its own palette: bg + matching icon color
const ACCENTS = {
  sessions:    { bg: '#fde8ec', icon: '#b91c3c' }, // soft rose + deep rose
  completed:   { bg: '#fdf4e7', icon: '#92400e' }, // warm cream + amber
  submissions: { bg: '#e8f4fd', icon: '#1e6fb9' }, // ice blue + ocean blue
  accuracy:    { bg: '#f0fdf4', icon: '#15803d' }, // mint tint + forest green
  dueCards:    { bg: '#fef3c7', icon: '#b45309' }, // honey gold + burnt amber
} as const

// ─── Card config ────────────────────────────────────────────────────────────
interface ActivityCardConfig {
  icon: Icon
  label: string
  value: number | string
  accentKey: keyof typeof ACCENTS
}

function ActivityCard({ icon: IconCmp, label, value, accentKey }: ActivityCardConfig) {
  const accent = ACCENTS[accentKey]
  return (
    <Card className="card-editorial p-3 flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: accent.bg }}
      >
        <IconCmp size={18} style={{ color: accent.icon }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate leading-tight" style={{ color: 'var(--on-surface-variant)' }}>
          {label}
        </p>
        <p className="text-lg font-bold tabular-nums leading-tight" style={{ color: 'var(--on-surface)' }}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
      </div>
    </Card>
  )
}

function ActivityZoneSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="card-editorial p-3 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-5 w-12" />
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DashboardActivityZone() {
  const { data, isLoading } = useLearningOverview()

  if (isLoading || !data) return <ActivityZoneSkeleton />

  const { sessionsToday, completedSessionsToday, submissionsToday, dueCardsNow, averageAccuracy } = data

  return (
    <section aria-labelledby="activity-zone-title">
      <h3 id="activity-zone-title" className="sr-only">{C.activitySectionTitle}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <ActivityCard
          icon={MonitorPlayIcon}
          label="Phiên học"
          value={sessionsToday}
          accentKey="sessions"
        />
        <ActivityCard
          icon={CheckCircleIcon}
          label="Hoàn thành"
          value={completedSessionsToday}
          accentKey="completed"
        />
        <ActivityCard
          icon={PaperPlaneTiltIcon}
          label="Lượt nộp"
          value={submissionsToday}
          accentKey="submissions"
        />
        <ActivityCard
          icon={TargetIcon}
          label="Độ chính xác"
          value={`${averageAccuracy.toFixed(1)}%`}
          accentKey="accuracy"
        />
        <ActivityCard
          icon={CardsIcon}
          label="Thẻ cần ôn"
          value={dueCardsNow}
          accentKey="dueCards"
        />
      </div>
    </section>
  )
}