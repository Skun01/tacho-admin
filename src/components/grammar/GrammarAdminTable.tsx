import { format } from 'date-fns'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { ADMIN_COMMON_CONTENT, ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { GRAMMAR_STATUS_LABELS, getGrammarRegisterLabel, type GrammarAdminItem } from '@/types/grammarAdmin'

interface GrammarAdminTableProps {
  items: GrammarAdminItem[]
  isLoading: boolean
  isFetching: boolean
  isDeleting: boolean
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  onCreate: () => void
  onOpenEdit: (item: GrammarAdminItem) => void
  onDelete: (item: GrammarAdminItem) => void
}

function StatusBadge({ status }: { status: GrammarAdminItem['status'] }) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    Published: 'default',
    Draft: 'secondary',
    Archived: 'outline',
  }

  return <Badge variant={variants[status] ?? 'secondary'}>{GRAMMAR_STATUS_LABELS[status]}</Badge>
}

export function GrammarAdminTable({
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
}: GrammarAdminTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_GRAMMAR_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_GRAMMAR_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_GRAMMAR_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_GRAMMAR_CONTENT.emptyTitle}
      emptyDescription={ADMIN_GRAMMAR_CONTENT.emptyDescription}
      emptyActionLabel={ADMIN_GRAMMAR_CONTENT.emptyActionLabel}
      onEmptyAction={onCreate}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_GRAMMAR_CONTENT.columns.title}</TableHead>
            <TableHead className="hidden md:table-cell">{ADMIN_GRAMMAR_CONTENT.columns.register}</TableHead>
            <TableHead className="hidden md:table-cell">{ADMIN_GRAMMAR_CONTENT.columns.level}</TableHead>
            <TableHead className="hidden lg:table-cell">{ADMIN_GRAMMAR_CONTENT.columns.structures}</TableHead>
            <TableHead>{ADMIN_GRAMMAR_CONTENT.columns.status}</TableHead>
            <TableHead className="hidden lg:table-cell">{ADMIN_GRAMMAR_CONTENT.columns.createdAt}</TableHead>
            <TableHead className="hidden lg:table-cell">{ADMIN_GRAMMAR_CONTENT.columns.updatedAt}</TableHead>
            <TableHead className="text-right">{ADMIN_GRAMMAR_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="space-y-0.5">
                  <div className="font-medium" style={{ color: 'var(--on-surface)' }}>
                    {item.title}
                  </div>
                  <div className="line-clamp-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {item.summary || ADMIN_GRAMMAR_CONTENT.summaryFallbackLabel}
                  </div>
                  {item.alternateForms.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.alternateForms.map((form, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1">
                          {form}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {item.register ? (
                  <Badge variant="secondary">{getGrammarRegisterLabel(item.register)}</Badge>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {ADMIN_COMMON_CONTENT.emptyValueLabel}
                  </span>
                )}
              </TableCell>
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
                <span className="text-xs">{ADMIN_GRAMMAR_CONTENT.structuresCountLabel(item.structuresCount)}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-xs">{format(new Date(item.createdAt), 'dd/MM/yyyy')}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-xs">
                  {item.updatedAt ? format(new Date(item.updatedAt), 'dd/MM/yyyy') : ADMIN_COMMON_CONTENT.notUpdatedLabel}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenEdit(item)}>
                    <PencilSimpleIcon size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(item)}
                    disabled={isDeleting}
                  >
                    <TrashIcon size={16} />
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
