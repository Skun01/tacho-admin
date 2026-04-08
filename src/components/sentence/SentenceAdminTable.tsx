import { format } from 'date-fns'
import { SpeakerHighIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT, ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import type { SentenceAdminItem } from '@/types/sentenceAdmin'

interface SentenceAdminTableProps {
  items: SentenceAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onOpenEdit: (item: SentenceAdminItem) => void
  onDelete: (item: SentenceAdminItem) => void
  onPlayAudio: (audioUrl?: string | null) => void
}

export function SentenceAdminTable({
  items,
  isLoading,
  isFetching,
  isDeleting,
  currentPage,
  totalPage,
  onPageChange,
  onOpenEdit,
  onDelete,
  onPlayAudio,
}: SentenceAdminTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_SENTENCE_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_SENTENCE_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_SENTENCE_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_SENTENCE_CONTENT.emptyTitle}
      emptyDescription={ADMIN_SENTENCE_CONTENT.emptyDescription}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.text}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.meaning}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.level}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.updatedAt}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{item.text}</span>
                  {item.audioUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onPlayAudio(item.audioUrl)}
                      aria-label={ADMIN_SENTENCE_CONTENT.form.playAudioLabel}
                    >
                      <SpeakerHighIcon size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.meaning}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.level ?? '-'}</Badge>
              </TableCell>
              <TableCell>
                {item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm') : ADMIN_COMMON_CONTENT.notUpdatedLabel}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onOpenEdit(item)}>
                    {ADMIN_SENTENCE_CONTENT.actions.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item)}
                    disabled={isDeleting}
                  >
                    {ADMIN_SENTENCE_CONTENT.actions.delete}
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