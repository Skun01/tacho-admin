import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useDeckAnalytics } from '@/hooks/useLearningAdminQueries'
import { STUDY_MODE_LABELS } from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.analytics

interface MetricCardProps {
  label: string
  value: string | number
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>{label}</p>
      <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--on-surface)' }}>{value}</p>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

interface DeckAnalyticsSectionProps {
  deckId: string
}

export function DeckAnalyticsSection({ deckId }: DeckAnalyticsSectionProps) {
  const { data, isLoading } = useDeckAnalytics(deckId)

  if (isLoading || !data) return <AnalyticsSkeleton />

  return (
    <div className="space-y-6">
      {/* Metric grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label={C.sessionCountLabel} value={data.sessionCount} />
        <MetricCard label={C.completedSessionCountLabel} value={data.completedSessionCount} />
        <MetricCard label={C.submissionCountLabel} value={data.submissionCount} />
        <MetricCard label={C.averageAccuracyLabel} value={`${data.averageAccuracy.toFixed(1)}%`} />
        <MetricCard label={C.trackedCardsLabel} value={data.trackedCards} />
        <MetricCard label={C.masteredCardsLabel} value={data.masteredCards} />
        <MetricCard label={C.dueCardsLabel} value={data.dueCards} />
      </div>

      {/* Mode breakdown */}
      {data.modeBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{C.modeBreakdownTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{C.modeBreakdownColumns.mode}</TableHead>
                  <TableHead className="text-right">{C.modeBreakdownColumns.sessions}</TableHead>
                  <TableHead className="text-right">{C.modeBreakdownColumns.completed}</TableHead>
                  <TableHead className="text-right">{C.modeBreakdownColumns.submissions}</TableHead>
                  <TableHead className="text-right">{C.modeBreakdownColumns.accuracy}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.modeBreakdown.map((row) => (
                  <TableRow key={row.mode}>
                    <TableCell className="font-medium">{STUDY_MODE_LABELS[row.mode]}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.sessionCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.completedSessionCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.submissionCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.averageAccuracy.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
