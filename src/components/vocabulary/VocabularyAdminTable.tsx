import { format } from 'date-fns'
import { PauseIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT, ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { VocabularyAdminItem } from '@/types/vocabularyAdmin'
import { getVocabularyStatusLabel, getVocabularyWordTypeLabel } from '@/types/vocabularyAdmin'

interface VocabularyAdminTableProps {
  items: VocabularyAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  playingAudioUrl: string | null
  onPlayAudio: (audioUrl?: string | null) => void
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
  onCreate,
  playingAudioUrl,
  onPlayAudio,
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
      emptyActionLabel={ADMIN_VOCABULARY_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.title}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.wordType}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.level}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.tags}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.status}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.createdAt}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.updatedAt}</TableHead>
            <TableHead>{ADMIN_VOCABULARY_CONTENT.columns.actions}</TableHead>
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
                        aria-label={
                          isPlayingAudio
                            ? ADMIN_VOCABULARY_CONTENT.audioPauseLabel
                            : ADMIN_VOCABULARY_CONTENT.audioPlayLabel
                        }
                      >
                        {isPlayingAudio ? <PauseIcon size={16} /> : <SpeakerHighIcon size={16} />}
                      </Button>
                    )}
                    <p>{item.title}</p>
                  </div>
                  {item.reading && (
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {item.reading}
                    </p>
                  )}
                  <p className="max-w-[360px] truncate text-xs" style={{ color: 'var(--on-surface-variant)' }} title={item.summary}>
                    {item.summary || ADMIN_VOCABULARY_CONTENT.summaryFallbackLabel}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {item.wordType ? getVocabularyWordTypeLabel(item.wordType) : ADMIN_COMMON_CONTENT.emptyValueLabel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.level ?? ADMIN_COMMON_CONTENT.emptyValueLabel}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ADMIN_VOCABULARY_CONTENT.tagsCountLabel(item.tags.length)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>{getVocabularyStatusLabel(item.status)}</Badge>
                </TableCell>
                <TableCell>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
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
            )
          })}
        </TableBody>
      </Table>
    </AdminTableSection>
  )
}
