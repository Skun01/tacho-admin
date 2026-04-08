import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'

interface AdminTableSectionProps {
  title: string
  isLoading: boolean
  isFetching: boolean
  hasItems: boolean
  currentPage: number
  totalPage: number
  previousPageLabel: string
  nextPageLabel: string
  emptyTitle: string
  emptyDescription: string
  onPageChange: (page: number) => void
  children: ReactNode
}

export function AdminTableSection({
  title,
  isLoading,
  isFetching,
  hasItems,
  currentPage,
  totalPage,
  previousPageLabel,
  nextPageLabel,
  emptyTitle,
  emptyDescription,
  onPageChange,
  children,
}: AdminTableSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isLoading || isFetching) && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {!isLoading && hasItems && children}

        {!isLoading && !hasItems && (
          <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--surface-container, rgba(0, 0, 0, 0.03))' }}>
            <p className="font-medium">{emptyTitle}</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {emptyDescription}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_COMMON_CONTENT.pageInfoLabel(currentPage, totalPage)}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isFetching}
            >
              {previousPageLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPage || isFetching}
            >
              {nextPageLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}