import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/content/admin/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT, ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import type { VocabularyAdminItem } from '@/types/vocabularyAdmin'
import { getVocabularyStatusLabel } from '@/types/vocabularyAdmin'

interface VocabularyAdminTableProps {
  items: VocabularyAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onOpenEdit: (item: VocabularyAdminItem) => void
  onDelete: (item: VocabularyAdminItem) => void
}

export function VocabularyAdminTable({
  items,
  isLoading,
  isFetching,
  isDeleting,
  currentPage,
  totalPage,
  onPageChange,
  onOpenEdit,
  onDelete,
}: VocabularyAdminTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_VOCABULARY_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_VOCABULARY_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_VOCABULARY_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_VOCABULARY_CONTENT.emptyTitle}
      emptyDescription={ADMIN_VOCABULARY_CONTENT.emptyDescription}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.title}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.level}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.status}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.updatedAt}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <p>{item.title}</p>
                {item.reading && (
                  <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {item.reading}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.level ?? '-'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>{getVocabularyStatusLabel(item.status)}</Badge>
              </TableCell>
              <TableCell>
                {item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm') : ADMIN_COMMON_CONTENT.notUpdatedLabel}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onOpenEdit(item)}>
                    {ADMIN_VOCABULARY_CONTENT.actions.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item)}
                    disabled={isDeleting}
                  >
                    {ADMIN_VOCABULARY_CONTENT.actions.delete}
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