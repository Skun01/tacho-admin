import { Helmet } from 'react-helmet-async'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { DashboardUserSummary } from '@/components/learning/DashboardUserSummary'
import { DashboardContentSummary } from '@/components/learning/DashboardContentSummary'
import { DashboardLearningActivity } from '@/components/learning/DashboardLearningActivity'
import { DashboardQuickActions } from '@/components/learning/DashboardQuickActions'

const C = ADMIN_LEARNING_CONTENT.overview

export function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>{C.pageTitle} | Tacho Admin</title>
      </Helmet>

      <div className="space-y-8">
        <header>
          <h2
            className="font-heading-vn text-2xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {C.heading}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {C.description}
          </p>
        </header>

        <DashboardUserSummary />

        <DashboardContentSummary />

        <DashboardLearningActivity />

        <DashboardQuickActions />
      </div>
    </>
  )
}