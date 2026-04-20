import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useDeckCoverage } from '@/hooks/useLearningAdminQueries'
import { CARD_TYPE_LABELS } from '@/types/learningAdmin'

const C = ADMIN_LEARNING_CONTENT.coverage

interface StatItemProps {
  label: string
  value: number
  total: number
}

function StatItem({ label, value, total }: StatItemProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>{label}</p>
      <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--on-surface)' }}>
        {value}<span className="text-sm font-normal opacity-60">/{total}</span>
      </p>
      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: 'var(--surface-container-high)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: 'var(--primary)' }}
        />
      </div>
    </div>
  )
}

function CoverageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-1.5 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

interface DeckCoverageSectionProps {
  deckId: string
}

export function DeckCoverageSection({ deckId }: DeckCoverageSectionProps) {
  const { data, isLoading } = useDeckCoverage(deckId)

  if (isLoading || !data) return <CoverageSkeleton />

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatItem label={C.fillInBlankReadyLabel} value={data.fillInBlankReadyCount} total={data.totalCards} />
        <StatItem label={C.multipleChoiceReadyLabel} value={data.multipleChoiceReadyCount} total={data.totalCards} />
        <StatItem label={C.flashcardReadyLabel} value={data.flashcardReadyCount} total={data.totalCards} />
        <div className="space-y-1.5">
          <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>{C.issueCountLabel}</p>
          <p className="text-xl font-bold tabular-nums" style={{ color: data.issueCount > 0 ? 'var(--error)' : 'var(--on-surface)' }}>
            {data.issueCount}
          </p>
        </div>
      </div>

      {/* Breakdown by card type */}
      {data.cardsByType.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{C.breakdownTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{C.breakdownColumns.cardType}</TableHead>
                  <TableHead className="text-right">{C.breakdownColumns.total}</TableHead>
                  <TableHead className="text-right">{C.breakdownColumns.fillInBlank}</TableHead>
                  <TableHead className="text-right">{C.breakdownColumns.multipleChoice}</TableHead>
                  <TableHead className="text-right">{C.breakdownColumns.flashcard}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.cardsByType.map((row) => (
                  <TableRow key={row.cardType}>
                    <TableCell className="font-medium">{CARD_TYPE_LABELS[row.cardType]}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.total}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.fillInBlankReady}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.multipleChoiceReady}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.flashcardReady}</TableCell>
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
