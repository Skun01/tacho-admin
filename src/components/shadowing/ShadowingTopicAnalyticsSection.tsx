import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import type {
  ShadowingSentenceAnalyticsResponse,
  ShadowingTopicAnalyticsResponse,
} from '@/types/shadowingAdmin'

interface ShadowingTopicAnalyticsSectionProps {
  isLoadingTopicAnalytics: boolean
  isLoadingSentenceAnalytics: boolean
  topicAnalytics?: ShadowingTopicAnalyticsResponse
  sentenceAnalytics: ShadowingSentenceAnalyticsResponse[]
}

export function ShadowingTopicAnalyticsSection({
  isLoadingTopicAnalytics,
  isLoadingSentenceAnalytics,
  topicAnalytics,
  sentenceAnalytics,
}: ShadowingTopicAnalyticsSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium">{SHADOWING_ADMIN_CONTENT.analyticsSectionTitle}</h3>

      {isLoadingTopicAnalytics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : topicAnalytics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title={SHADOWING_ADMIN_CONTENT.totalAttemptsLabel}
            value={topicAnalytics.attemptsCount}
          />
          <MetricCard
            title={SHADOWING_ADMIN_CONTENT.distinctUsersLabel}
            value={topicAnalytics.distinctUsersCount}
          />
          <MetricCard
            title={SHADOWING_ADMIN_CONTENT.averageScoreLabel}
            value={
              topicAnalytics.averagePronScore !== null
                ? Math.round(topicAnalytics.averagePronScore)
                : SHADOWING_ADMIN_CONTENT.noneSymbol
            }
            colorClass={
              topicAnalytics.averagePronScore !== null
                ? getScoreColorClass(Math.round(topicAnalytics.averagePronScore))
                : undefined
            }
          />
          <MetricCard
            title={SHADOWING_ADMIN_CONTENT.latestAttemptLabel}
            value={
              topicAnalytics.latestAttemptAt
                ? new Date(topicAnalytics.latestAttemptAt).toLocaleDateString('vi-VN')
                : SHADOWING_ADMIN_CONTENT.noneSymbol
            }
          />
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {SHADOWING_ADMIN_CONTENT.noDataLabel}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{SHADOWING_ADMIN_CONTENT.sentenceAnalyticsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.positionColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.sentenceAnalyticsTextColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.attemptsColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.usersColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.avgScoreColumn}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSentenceAnalytics ? (
                  Array.from({ length: 5 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: 5 }).map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : sentenceAnalytics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      {SHADOWING_ADMIN_CONTENT.noDataLabel}
                    </TableCell>
                  </TableRow>
                ) : (
                  sentenceAnalytics.map((item) => (
                    <TableRow key={item.sentenceId}>
                      <TableCell>{item.position}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.text}</TableCell>
                      <TableCell>{item.attemptsCount}</TableCell>
                      <TableCell>{item.distinctUsersCount}</TableCell>
                      <TableCell>
                        {item.averagePronScore !== null
                          ? (
                            <span className={`font-medium ${getScoreColorClass(Math.round(item.averagePronScore))}`}>
                              {Math.round(item.averagePronScore)}
                            </span>
                          )
                          : SHADOWING_ADMIN_CONTENT.noneSymbol}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  colorClass?: string
}

function MetricCard({ title, value, colorClass }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${colorClass ?? ''}`}>{value}</p>
      </CardContent>
    </Card>
  )
}

function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}
