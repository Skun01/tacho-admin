import {
  ExportIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  JLPT_EXAM_CONTENT,
  JLPT_LEVEL_LABELS,
  PUBLISH_STATUS_LABELS,
} from '@/constants/jlptAdmin'
import type { ExamListItemResponse } from '@/types/jlptAdmin'

interface JlptExamAdminTableProps {
  items: ExamListItemResponse[]
  isLoading: boolean
  isFetching: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  onOpenDetail: (item: ExamListItemResponse) => void
  onDelete: (item: ExamListItemResponse) => void
  onExportExam: (item: ExamListItemResponse) => void
}

export function JlptExamAdminTable({
  items,
  isLoading,
  isFetching,
  currentPage,
  totalPage,
  onPageChange,
  onCreate,
  onOpenDetail,
  onDelete,
  onExportExam,
}: JlptExamAdminTableProps) {
  return (
    <AdminTableSection
      title={JLPT_EXAM_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={JLPT_EXAM_CONTENT.previousPageLabel}
      nextPageLabel={JLPT_EXAM_CONTENT.nextPageLabel}
      emptyTitle={JLPT_EXAM_CONTENT.emptyTitle}
      emptyDescription={JLPT_EXAM_CONTENT.emptyDescription}
      emptyActionLabel={JLPT_EXAM_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{JLPT_EXAM_CONTENT.columns.title}</TableHead>
            <TableHead>{JLPT_EXAM_CONTENT.columns.level}</TableHead>
            <TableHead>{JLPT_EXAM_CONTENT.columns.duration}</TableHead>
            <TableHead>{JLPT_EXAM_CONTENT.columns.status}</TableHead>
            <TableHead>{JLPT_EXAM_CONTENT.columns.sections}</TableHead>
            <TableHead>{JLPT_EXAM_CONTENT.columns.creator}</TableHead>
            <TableHead className="text-right">{JLPT_EXAM_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onOpenDetail(item)}>
              <TableCell className="min-w-[240px] font-medium">{item.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{JLPT_LEVEL_LABELS[item.level]}</Badge>
              </TableCell>
              <TableCell>{item.totalDurationMinutes}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                  {PUBLISH_STATUS_LABELS[item.status]}
                </Badge>
              </TableCell>
              <TableCell>{item.sectionsCount}</TableCell>
              <TableCell>{item.creatorName}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  {item.status !== 'Published' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={JLPT_EXAM_CONTENT.actions.edit}
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenDetail(item)
                      }}
                    >
                      <PencilSimpleIcon size={16} />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title={JLPT_EXAM_CONTENT.actions.exportJson}
                    onClick={(event) => {
                      event.stopPropagation()
                      onExportExam(item)
                    }}
                  >
                    <ExportIcon size={16} />
                  </Button>
                  {item.status === 'Draft' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      title={JLPT_EXAM_CONTENT.actions.delete}
                      onClick={(event) => {
                        event.stopPropagation()
                        onDelete(item)
                      }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminTableSection>
  )
}
