import { DotsThreeOutlineVerticalIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  SHADOWING_ADMIN_CONTENT,
  SHADOWING_LEVEL_LABELS,
  SHADOWING_STATUS_LABELS,
  SHADOWING_VISIBILITY_LABELS,
} from '@/constants/shadowingAdmin'
import type { ShadowingTopicListItemResponse } from '@/types/shadowingAdmin'

interface ShadowingAdminTableProps {
  items: ShadowingTopicListItemResponse[]
  isLoading: boolean
  isFetching: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  onOpenDetail: (item: ShadowingTopicListItemResponse) => void
  onDelete: (item: ShadowingTopicListItemResponse) => void
}

export function ShadowingAdminTable({
  items,
  isLoading,
  isFetching,
  currentPage,
  totalPage,
  onPageChange,
  onCreate,
  onOpenDetail,
  onDelete,
}: ShadowingAdminTableProps) {
  return (
    <AdminTableSection
      title={SHADOWING_ADMIN_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={SHADOWING_ADMIN_CONTENT.previousPageLabel}
      nextPageLabel={SHADOWING_ADMIN_CONTENT.nextPageLabel}
      emptyTitle={SHADOWING_ADMIN_CONTENT.emptyTitle}
      emptyDescription={SHADOWING_ADMIN_CONTENT.emptyDescription}
      emptyActionLabel={SHADOWING_ADMIN_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.title}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.level}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.status}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.visibility}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.official}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.sentencesCount}</TableHead>
            <TableHead>{SHADOWING_ADMIN_CONTENT.columns.owner}</TableHead>
            <TableHead className="text-right">{SHADOWING_ADMIN_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onOpenDetail(item)}>
              <TableCell className="min-w-[260px]">
                <div className="space-y-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.description || SHADOWING_ADMIN_CONTENT.noneSymbol}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {item.level ? (
                  <Badge variant="outline">{SHADOWING_LEVEL_LABELS[item.level]}</Badge>
                ) : (
                  SHADOWING_ADMIN_CONTENT.noneSymbol
                )}
              </TableCell>
              <TableCell>
                <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                  {SHADOWING_STATUS_LABELS[item.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{SHADOWING_VISIBILITY_LABELS[item.visibility]}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.isOfficial ? 'default' : 'outline'}>
                  {item.isOfficial
                    ? SHADOWING_ADMIN_CONTENT.topicInfoOfficialBadgeLabel
                    : SHADOWING_ADMIN_CONTENT.topicInfoRegularBadgeLabel}
                </Badge>
              </TableCell>
              <TableCell>{item.sentencesCount}</TableCell>
              <TableCell>{item.creatorName}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpenDetail(item)
                    }}
                  >
                    <PencilSimpleIcon size={16} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <DotsThreeOutlineVerticalIcon size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOpenDetail(item)}>
                        {SHADOWING_ADMIN_CONTENT.actions.openDetail}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
                        {SHADOWING_ADMIN_CONTENT.actions.delete}
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
