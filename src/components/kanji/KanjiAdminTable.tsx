import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { ADMIN_KANJI_CONTENT, ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import { KANJI_STATUS_LABELS, type KanjiAdminItem } from '@/types/kanjiAdmin'

interface KanjiAdminTableProps {
  items: KanjiAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  onOpenEdit: (item: KanjiAdminItem) => void
  onDelete: (item: KanjiAdminItem) => void
}

function StatusBadge({ status }: { status: KanjiAdminItem['status'] }) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    Published: 'default',
    Draft: 'secondary',
    Archived: 'outline',
  }

  return <Badge variant={variants[status] ?? 'secondary'}>{KANJI_STATUS_LABELS[status]}</Badge>
}

export function KanjiAdminTable({
  items,
  isLoading,
  isFetching,
  isDeleting,
  currentPage,
  totalPage,
  onPageChange,
  onCreate,
  onOpenEdit,
  onDelete,
}: KanjiAdminTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_KANJI_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_KANJI_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_KANJI_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_KANJI_CONTENT.emptyTitle}
      emptyDescription={ADMIN_KANJI_CONTENT.emptyDescription}
      emptyActionLabel={ADMIN_KANJI_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_KANJI_CONTENT.columns.kanji}</TableHead>
            <TableHead className="hidden md:table-cell">{ADMIN_KANJI_CONTENT.columns.strokeCount}</TableHead>
            <TableHead className="hidden md:table-cell">{ADMIN_KANJI_CONTENT.columns.hanViet}</TableHead>
            <TableHead className="hidden md:table-cell">{ADMIN_KANJI_CONTENT.columns.level}</TableHead>
            <TableHead className="hidden lg:table-cell">{ADMIN_KANJI_CONTENT.columns.radicals}</TableHead>
            <TableHead>{ADMIN_KANJI_CONTENT.columns.status}</TableHead>
            <TableHead className="hidden lg:table-cell">{ADMIN_KANJI_CONTENT.columns.createdAt}</TableHead>
            <TableHead className="text-right">{ADMIN_KANJI_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl font-bold"
                    style={{ backgroundColor: 'var(--surface-container, rgba(0, 0, 0, 0.04))', color: 'var(--on-surface)' }}
                  >
                    {item.kanji}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium" style={{ color: 'var(--on-surface)' }}>{item.title}</div>
                    <div className="line-clamp-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {item.meaningVi || ADMIN_KANJI_CONTENT.summaryFallbackLabel}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-center text-sm">{item.strokeCount}</TableCell>
              <TableCell className="hidden md:table-cell text-sm">{item.hanViet || ADMIN_COMMON_CONTENT.emptyValueLabel}</TableCell>
              <TableCell className="hidden md:table-cell">
                {item.level ? (
                  <Badge variant="outline">{item.level}</Badge>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {ADMIN_COMMON_CONTENT.emptyValueLabel}
                  </span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-xs">{ADMIN_KANJI_CONTENT.radicalCountLabel(item.radicalCount)}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-xs">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenEdit(item)}>
                    <PencilSimpleIcon size={16} style={{ color: '#92400e' }} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(item)}
                    disabled={isDeleting}
                  >
                    <TrashIcon size={16} style={{ color: '#b91c1c' }} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminTableSection>
  )
}
