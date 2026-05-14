import { Helmet } from '@dr.pogodin/react-helmet'
import { Link } from 'react-router'
import { CardsIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardActivityZone } from '@/components/learning/DashboardActivityZone'
import { useDeckAdminList } from '@/hooks/useDeckAdminList'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'

const C = ADMIN_LEARNING_CONTENT.learningPage

export function AdminLearningPage() {
  const { data: deckData, isLoading: isLoadingDecks } = useDeckAdminList({ page: 1, pageSize: 20 })

  return (
    <>
      <Helmet>
        <title>{C.pageTitle}</title>
      </Helmet>

      <div className="space-y-8">
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

        <section>
          <h3
            className="mb-3 text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {C.activityTitle}
          </h3>
          <DashboardActivityZone />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {C.deckSectionTitle}
            </h3>
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {C.deckSectionDescription}
            </p>
          </div>

          {isLoadingDecks ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </Card>
              ))}
            </div>
          ) : !deckData?.items.length ? (
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {C.emptyDecksLabel}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deckData.items.map((deck) => (
                <Card key={deck.id} className="p-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'var(--surface-container-high)' }}
                  >
                    <CardsIcon size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--on-surface)' }}>
                      {deck.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {deck.cardsCount} thẻ
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="shrink-0">
                    <Link to={`/admin/decks/${deck.id}/coverage`}>
                      <ArrowRightIcon size={14} />
                      {C.viewAnalyticsLabel}
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
