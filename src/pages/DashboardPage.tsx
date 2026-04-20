import { Helmet } from 'react-helmet-async'
import { LearningOverviewCards } from '@/components/learning/LearningOverviewCards'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'

const C = ADMIN_LEARNING_CONTENT.overview

export function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>{C.pageTitle}</title>
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
      </div>
    </>
  )
}