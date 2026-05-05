import { format } from 'date-fns'
import { ArchiveBoxIcon, DotsThreeOutlineVerticalIcon, EyeIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import {
  ADMIN_DECK_CONTENT,
  DECK_ADMIN_STATUS_LABELS,
  DECK_ADMIN_VISIBILITY_LABELS,
} from '@/constants/adminDeck'
import type { AdminDeckListItemResponse } from '@/types/deckAdmin'

interface AdminDeckTableProps {
  items: AdminDeckListItemResponse[]
  isLoading: boolean
  isFetching: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  onOpenEdit: (item: AdminDeckListItemResponse) => void
  onDelete: (item: AdminDeckListItemResponse) => void
  onPublish: (item: AdminDeckListItemResponse) => void
  onUnpublish: (item: AdminDeckListItemResponse) => void
  onArchive: (item: AdminDeckListItemResponse) => void
}

export function AdminDeckTable({
  items,
  isLoading,
  isFetching,
  currentPage,
  totalPage,
  onPageChange,
  onCreate,
  onOpenEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onArchive,
}: AdminDeckTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_DECK_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_DECK_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_DECK_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_DECK_CONTENT.emptyTitle}
      emptyDescription={ADMIN_DECK_CONTENT.emptyDescription}
      emptyActionLabel={ADMIN_DECK_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_DECK_CONTENT.columns.title}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.type}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.owner}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.status}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.visibility}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.official}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.counters}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.updatedAt}</TableHead>
            <TableHead>{ADMIN_DECK_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="min-w-[260px]">
                <div className="space-y-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.description || ADMIN_COMMON_CONTENT.emptyValueLabel}
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.type.name ?? ADMIN_COMMON_CONTENT.emptyValueLabel}</TableCell>
              <TableCell>{item.createdBy.username}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                  {DECK_ADMIN_STATUS_LABELS[item.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{DECK_ADMIN_VISIBILITY_LABELS[item.visibility]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.isOfficial ? 'default' : 'outline'}>
                  {item.isOfficial ? ADMIN_DECK_CONTENT.editor.officialBadgeLabel : ADMIN_DECK_CONTENT.editor.regularBadgeLabel}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-xs text-muted-foreground">
                  <div>{item.cardsCount} thẻ</div>
                  <div>{item.foldersCount} thư mục</div>
                  <div>{item.bookmarkCount} bookmark</div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(item.updatedAt ?? item.createdAt), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenEdit(item)}>
                    <PencilSimpleIcon size={16} style={{ color: '#92400e' }} />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenEdit(item)}>
                    <EyeIcon size={16} style={{ color: 'var(--primary)' }} />
                  </Button>
                  {item.status !== 'Archived' && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onArchive(item)}>
                      <ArchiveBoxIcon size={16} style={{ color: '#92400e' }} />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                        <DotsThreeOutlineVerticalIcon size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.status === 'Draft' && (
                        <DropdownMenuItem onClick={() => onPublish(item)}>
                          {ADMIN_DECK_CONTENT.statusActions.publish}
                        </DropdownMenuItem>
                      )}
                      {item.status === 'Published' && (
                        <DropdownMenuItem onClick={() => onUnpublish(item)}>
                          {ADMIN_DECK_CONTENT.statusActions.unpublish}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
                        {ADMIN_DECK_CONTENT.actions.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminTableSection>
  )
}
