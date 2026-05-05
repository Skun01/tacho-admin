import { Helmet } from '@dr.pogodin/react-helmet'
import { Card } from '@/components/ui/card'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { DashboardStatEditorial } from '@/components/learning/DashboardStatEditorial'
import { DashboardActivityZone } from '@/components/learning/DashboardActivityZone'
import { DashboardQuickActions } from '@/components/learning/DashboardQuickActions'

const C = ADMIN_LEARNING_CONTENT.overview

export function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>{C.pageTitle} | Tacho Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ─────────────────────────────────── */}
        <header>
          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--on-surface)' }}
          >
            {C.heading}
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {C.description}
          </p>
        </header>

        {/* ── Stats ───────────────────────────────────────── */}
        <DashboardStatEditorial />

        {/* ── Quick Actions + Activity Zone ─────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Quick actions — narrower right column */}
          <div className="lg:w-72 shrink-0">
            <Card className="card-editorial p-4">
              <DashboardQuickActions />
            </Card>
          </div>

          {/* Activity zone — fills remaining width */}
          <div className="flex-1 min-w-0">
            <DashboardActivityZone />
          </div>
        </div>
      </div>
    </>
  )
}