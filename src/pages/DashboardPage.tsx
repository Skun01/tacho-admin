import { Helmet } from 'react-helmet-async'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { DashboardQuickActions } from '@/components/learning/DashboardQuickActions'
import { DashboardStatsCards } from '@/components/learning/DashboardStatsCards'
import { LearningOverviewCards } from '@/components/learning/LearningOverviewCards'

const C = ADMIN_LEARNING_CONTENT.overview

export function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>{C.pageTitle} | Tacho Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h2
            className="font-heading-vn text-2xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {C.heading}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {C.description}
          </p>
        </div>

        <LearningOverviewCards />

        {/* Số liệu nội dung */}
        <section aria-labelledby="stats-section-title">
          <h3
            id="stats-section-title"
            className="mb-3 text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {C.statsSectionTitle}
          </h3>
          <DashboardStatsCards />
        </section>

        {/* Thao tác nhanh */}
        <DashboardQuickActions />
      </div>
    </>
  )
}