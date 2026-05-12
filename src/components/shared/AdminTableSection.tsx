import type { ReactNode } from 'react'
import { ProhibitIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'

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
  emptyActionLabel?: string
  onEmptyAction?: () => void
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
  emptyActionLabel,
  onEmptyAction,
  onPageChange,
  children,
}: AdminTableSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isLoading || isFetching) && <LoadingState variant="table" />}

        {!isLoading && hasItems && children}

        {!isLoading && !hasItems && (
          <EmptyState
            icon={ProhibitIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={
              onEmptyAction ? (
                <Button type="button" onClick={onEmptyAction}>
                  {emptyActionLabel ?? ADMIN_COMMON_CONTENT.createActionLabel}
                </Button>
              ) : undefined
            }
          />
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
