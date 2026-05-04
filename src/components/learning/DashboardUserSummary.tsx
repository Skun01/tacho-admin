import type { Icon } from '@phosphor-icons/react'
import { UsersIcon, UserPlusIcon, CalendarIcon, UserCircleCheckIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useUserSummary } from '@/hooks/useDashboardAdminQueries'

const C = ADMIN_LEARNING_CONTENT.overview

interface UserStatItemConfig {
  icon: Icon
  label: string
  valueKey: 'totalUsers' | 'newUsersToday' | 'newUsersThisWeek' | 'activeUsersToday'
  accentColor: string
  accentBg: string
}

const USER_STAT_ITEMS: UserStatItemConfig[] = [
  {
    icon: UsersIcon,
    label: C.totalUsersLabel,
    valueKey: 'totalUsers',
    accentColor: 'var(--primary)',
    accentBg: 'var(--primary-container)',
  },
  {
    icon: UserPlusIcon,
    label: C.newUsersTodayLabel,
    valueKey: 'newUsersToday',
    accentColor: 'var(--tertiary)',
    accentBg: 'var(--tertiary-container)',
  },
  {
    icon: CalendarIcon,
    label: C.newUsersThisWeekLabel,
    valueKey: 'newUsersThisWeek',
    accentColor: 'var(--secondary)',
    accentBg: 'var(--secondary-container)',
  },
  {
    icon: UserCircleCheckIcon,
    label: C.activeUsersTodayLabel,
    valueKey: 'activeUsersToday',
    accentColor: 'var(--tertiary)',
    accentBg: 'var(--tertiary-container)',
  },
]

function UserSummarySkeleton() {
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

export function DashboardUserSummary() {
  const { data, isLoading } = useUserSummary()

  if (isLoading || !data) return <UserSummarySkeleton />

  return (
    <section aria-labelledby="user-summary-title">
      <h3
        id="user-summary-title"
        className="mb-3 text-sm font-semibold uppercase tracking-wider"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {C.userSectionTitle}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {USER_STAT_ITEMS.map((item) => (
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
