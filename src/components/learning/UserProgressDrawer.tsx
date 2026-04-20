import { format } from 'date-fns'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useUserProgress } from '@/hooks/useLearningAdminQueries'

const C = ADMIN_LEARNING_CONTENT.analytics

interface UserProgressDrawerProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProgressDrawer({ userId, open, onOpenChange }: UserProgressDrawerProps) {
  const { data, isLoading } = useUserProgress(userId ?? '', open && Boolean(userId))

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 top-0 bottom-0 w-full max-w-xl flex flex-col rounded-none border-l" style={{ backgroundColor: 'var(--surface)' }}>
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle>{C.userTitle}</DrawerTitle>
          <DrawerDescription>
            {data ? `${data.username} — ${data.email}` : C.userDescription}
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
              {/* Summary metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricItem label={C.trackedCardsLabel} value={data.totalTrackedCards} />
                <MetricItem label={C.masteredCardsLabel} value={data.masteredCards} />
                <MetricItem label={C.dueCardsLabel} value={data.dueCards} />
                <MetricItem label={C.averageSrsLevelLabel} value={data.averageSrsLevel.toFixed(1)} />
                <MetricItem label={C.averageConsecutiveCorrectLabel} value={data.averageConsecutiveCorrect.toFixed(1)} />
                <MetricItem
                  label={C.lastReviewedAtLabel}
                  value={data.lastReviewedAt ? format(new Date(data.lastReviewedAt), 'dd/MM/yyyy HH:mm') : C.neverReviewedLabel}
                />
                <MetricItem label={C.recentSessionCountLabel} value={data.recentSessionCount} />
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
                            <TableCell className="text-right tabular-nums">{row.cardCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Deck progress */}
              {data.decks.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{C.deckUsageTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bộ thẻ</TableHead>
                          <TableHead className="text-right">{C.trackedCardsLabel}</TableHead>
                          <TableHead className="text-right">{C.masteredCardsLabel}</TableHead>
                          <TableHead className="text-right">{C.dueCardsLabel}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.decks.map((d) => (
                          <TableRow key={d.deckId}>
                            <TableCell className="font-medium">{d.deckTitle}</TableCell>
                            <TableCell className="text-right tabular-nums">{d.trackedCards}</TableCell>
                            <TableCell className="text-right tabular-nums">{d.masteredCards}</TableCell>
                            <TableCell className="text-right tabular-nums">{d.dueCards}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
