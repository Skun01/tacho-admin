import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router'
import { ArrowLeftIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { DeckCoverageSection } from '@/components/learning/DeckCoverageSection'
import { DeckAnalyticsSection } from '@/components/learning/DeckAnalyticsSection'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const C_COVERAGE = ADMIN_LEARNING_CONTENT.coverage
const C_ANALYTICS = ADMIN_LEARNING_CONTENT.analytics

export function AdminDeckCoveragePage() {
  const { id: deckId } = useParams<{ id: string }>()

  if (!deckId) {
    return (
      <div className="py-12 text-center">
        <p style={{ color: 'var(--on-surface-variant)' }}>{C_COVERAGE.notFoundLabel}</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{C_COVERAGE.pageTitle}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/decks">
              <ArrowLeftIcon size={16} className="mr-1" />
              {C_COVERAGE.backToDecksLabel}
            </Link>
          </Button>
        </div>

        <div>
          <h2
            className="font-heading-vn text-2xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {C_COVERAGE.heading}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {C_COVERAGE.description}
          </p>
        </div>

        {/* Tabbed content */}
        <Tabs defaultValue="coverage">
          <TabsList>
            <TabsTrigger value="coverage">{C_COVERAGE.heading}</TabsTrigger>
            <TabsTrigger value="analytics">{C_ANALYTICS.deckTitle}</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="mt-4">
            <DeckCoverageSection deckId={deckId} />
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link to={`/admin/learning/issues?deckId=${deckId}`}>
                  <WarningCircleIcon size={14} className="mr-1" />
                  {C_COVERAGE.viewIssuesLabel}
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <DeckAnalyticsSection deckId={deckId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
