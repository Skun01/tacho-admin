import { format } from 'date-fns'
import { PauseIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT, ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { SentenceAdminItem } from '@/types/sentenceAdmin'

interface SentenceAdminTableProps {
  items: SentenceAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  playingAudioUrl: string | null
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
  onCreate,
  playingAudioUrl,
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
      emptyActionLabel={ADMIN_SENTENCE_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.text}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.level}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.createdAt}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.updatedAt}</TableHead>
            <TableHead>{ADMIN_SENTENCE_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const resolvedAudioUrl = resolveApiMediaUrl(item.audioUrl)
            const isPlayingAudio = Boolean(resolvedAudioUrl && playingAudioUrl === resolvedAudioUrl)

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {resolvedAudioUrl && (
                      <Button
                        type="button"
                        variant={isPlayingAudio ? 'default' : 'ghost'}
                        size="icon-sm"
                        onClick={() => onPlayAudio(resolvedAudioUrl)}
                        aria-label={isPlayingAudio ? ADMIN_SENTENCE_CONTENT.audioPauseLabel : ADMIN_SENTENCE_CONTENT.audioPlayLabel}
                      >
                        {isPlayingAudio ? <PauseIcon size={16} /> : <SpeakerHighIcon size={16} />}
                      </Button>
                    )}
                    <span className="max-w-[340px] truncate" title={item.text}>
                      {item.text}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.level ?? ADMIN_COMMON_CONTENT.emptyValueLabel}</Badge>
                </TableCell>
                <TableCell>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
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
            )
          })}
        </TableBody>
      </Table>
    </AdminTableSection>
  )
}
