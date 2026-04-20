import { format } from 'date-fns'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-full max-w-xl flex flex-col rounded-none border-l" style={{ backgroundColor: 'var(--surface)' }}>
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle>{C.cardTitle}</DrawerTitle>
          <DrawerDescription>
            {data ? `${data.title} — ${CARD_TYPE_LABELS[data.cardType]}` : C.cardDescription}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          )}

          {!isLoading && data && (
            <>
              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-4">
                <MetricItem label={C.sessionCountLabel} value={data.includedSessionCount} />
                <MetricItem label={C.completedSessionCountLabel} value={data.includedCompletedSessionCount} />
                <MetricItem label={C.trackedUsersLabel} value={data.trackedUsers} />
                <MetricItem label={C.masteredUsersLabel} value={data.masteredUsers} />
                <MetricItem label={C.dueUsersLabel} value={data.dueUsers} />
                <MetricItem label={C.averageSrsLevelLabel} value={data.averageSrsLevel.toFixed(1)} />
                <MetricItem label={C.averageConsecutiveCorrectLabel} value={data.averageConsecutiveCorrect.toFixed(1)} />
                <MetricItem
                  label={C.lastReviewedAtLabel}
                  value={data.lastReviewedAt ? format(new Date(data.lastReviewedAt), 'dd/MM/yyyy HH:mm') : C.neverReviewedLabel}
                />
              </div>

              {/* SRS Distribution */}
              {data.srsDistribution.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.srsDistributionTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{C.srsDistributionColumns.level}</TableHead>
                          <TableHead className="text-right">{C.srsDistributionColumns.count}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.srsDistribution.map((row) => (
                          <TableRow key={row.srsLevel}>
                            <TableCell>{row.srsLevel}</TableCell>
                            <TableCell className="text-right tabular-nums">{row.userCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Deck usage */}
              {data.decks.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.deckUsageTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {data.decks.map((d) => (
                        <div key={d.deckId} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                          {d.deckTitle}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {C.closeLabel}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function MetricItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>{label}</p>
      <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--on-surface)' }}>{value}</p>
    </div>
  )
}
