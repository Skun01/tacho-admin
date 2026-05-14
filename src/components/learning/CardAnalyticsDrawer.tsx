import type { ReactNode } from 'react'
import { format } from 'date-fns'
import { CalendarDotIcon, ChartLineIcon, UsersIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useCardAnalytics } from '@/hooks/useLearningAdminQueries'
import { CARD_TYPE_LABELS } from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.analytics

interface CardAnalyticsDrawerProps {
  cardId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardAnalyticsDrawer({ cardId, open, onOpenChange }: CardAnalyticsDrawerProps) {
  const { data, isLoading } = useCardAnalytics(cardId ?? '', open && Boolean(cardId))

  const maxUsers = data?.srsDistribution.length
    ? Math.max(...data.srsDistribution.map((r) => r.userCount), 1)
    : 1

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-[880px] w-full p-0 gap-0 flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <SheetHeader className="border-b px-6 py-4 pr-12">
          <SheetTitle>{C.cardTitle}</SheetTitle>
          <SheetDescription>
            {data ? `${data.title} • ${CARD_TYPE_LABELS[data.cardType]}` : C.cardDescription}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-6 py-4">
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            )}

            {!isLoading && data && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.summaryLabel}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.summary ? (
                      <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        {data.summary}
                      </p>
                    ) : (
                      <Alert>
                        <ChartLineIcon />
                        <AlertTitle>{C.summaryLabel}</AlertTitle>
                        <AlertDescription>{C.noDeckUsageLabel}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard icon={<ChartLineIcon />} label={C.sessionCountLabel} value={data.includedSessionCount} />
                  <MetricCard icon={<ChartLineIcon />} label={C.completedSessionCountLabel} value={data.includedCompletedSessionCount} />
                  <MetricCard icon={<UsersIcon />} label={C.trackedUsersLabel} value={data.trackedUsers} />
                  <MetricCard icon={<UsersIcon />} label={C.masteredUsersLabel} value={data.masteredUsers} />
                  <MetricCard icon={<UsersIcon />} label={C.dueUsersLabel} value={data.dueUsers} />
                  <MetricCard icon={<ChartLineIcon />} label={C.averageSrsLevelLabel} value={data.averageSrsLevel.toFixed(1)} />
                  <MetricCard icon={<ChartLineIcon />} label={C.averageConsecutiveCorrectLabel} value={data.averageConsecutiveCorrect.toFixed(1)} />
                  <MetricCard
                    icon={<CalendarDotIcon />}
                    label={C.lastReviewedAtLabel}
                    value={data.lastReviewedAt ? format(new Date(data.lastReviewedAt), 'dd/MM/yyyy HH:mm') : C.neverReviewedLabel}
                  />
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.srsDistributionTitle}</CardTitle>
                    <CardDescription>{C.srsDistributionHint}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.srsDistribution.length === 0 && (
                      <Alert>
                        <ChartLineIcon />
                        <AlertTitle>{C.srsDistributionTitle}</AlertTitle>
                        <AlertDescription>{C.neverReviewedLabel}</AlertDescription>
                      </Alert>
                    )}
                    {data.srsDistribution.map((row) => (
                      <div key={row.srsLevel} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span>{row.srsLevel}</span>
                          <span className="tabular-nums">{row.userCount}</span>
                        </div>
                        <Progress value={Math.max(5, (row.userCount / maxUsers) * 100)} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.deckUsageTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.decks.length === 0 ? (
                      <Alert>
                        <UsersIcon />
                        <AlertTitle>{C.deckUsageTitle}</AlertTitle>
                        <AlertDescription>{C.noDeckUsageLabel}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {data.decks.map((deck) => (
                          <Badge key={deck.deckId} variant="secondary">
                            {deck.deckTitle}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end border-t px-6 py-4" style={{ backgroundColor: 'var(--surface)' }}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {C.closeLabel}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {icon}
          <span>{label}</span>
        </div>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
