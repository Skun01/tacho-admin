import { EyeIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AI_QUESTION_STATUS_LABELS,
  JLPT_AI_QUESTION_CONTENT,
  JLPT_LEVEL_LABELS,
  SECTION_TYPE_LABELS,
} from '@/constants/jlptAdmin'
import type { AiGeneratedQuestionResponse } from '@/types/jlptAdmin'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'Approved':
      return 'default'
    case 'Edited':
      return 'outline'
    default:
      return 'secondary'
  }
}

interface JlptAiQuestionAdminTableProps {
  items: AiGeneratedQuestionResponse[]
  isLoading: boolean
  isFetching: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onGenerate: () => void
  onViewDetail: (item: AiGeneratedQuestionResponse) => void
}

export function JlptAiQuestionAdminTable({
  items,
  isLoading,
  isFetching,
  currentPage,
  totalPage,
  onPageChange,
  onGenerate,
  onViewDetail,
}: JlptAiQuestionAdminTableProps) {
  return (
    <AdminTableSection
      title={JLPT_AI_QUESTION_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={JLPT_AI_QUESTION_CONTENT.previousPageLabel}
      nextPageLabel={JLPT_AI_QUESTION_CONTENT.nextPageLabel}
      emptyTitle={JLPT_AI_QUESTION_CONTENT.emptyTitle}
      emptyDescription={JLPT_AI_QUESTION_CONTENT.emptyDescription}
      emptyActionLabel={JLPT_AI_QUESTION_CONTENT.emptyActionLabel}
      onEmptyAction={onGenerate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.topic}</TableHead>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.level}</TableHead>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.sectionType}</TableHead>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.status}</TableHead>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.creator}</TableHead>
            <TableHead>{JLPT_AI_QUESTION_CONTENT.columns.createdAt}</TableHead>
            <TableHead className="text-right">{JLPT_AI_QUESTION_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onViewDetail(item)}>
              <TableCell className="min-w-[200px] font-medium">{item.topic}</TableCell>
              <TableCell>
                <Badge variant="outline">{JLPT_LEVEL_LABELS[item.level]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{SECTION_TYPE_LABELS[item.sectionType]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {AI_QUESTION_STATUS_LABELS[item.status]}
                </Badge>
              </TableCell>
              <TableCell>{item.creatorName}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(event) => {
                      event.stopPropagation()
                      onViewDetail(item)
                    }}
                  >
                    <EyeIcon size={16} style={{ color: 'var(--primary)' }} />
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
