import { format } from 'date-fns'
import { EnvelopeSimpleIcon, GearIcon, ShieldCheckIcon, ShieldSlashIcon, UserCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import type { AdminUserListItem } from '@/types/adminUser'
import { getAdminUserRoleLabel, getAdminUserStatusLabel } from '@/types/adminUser'

interface AdminUserTableProps {
  items: AdminUserListItem[]
  isLoading: boolean
  isFetching: boolean
  currentPage: number
  totalPage: number
  isTogglingStatus: boolean
  isTogglingVerification: boolean
  onPageChange: (page: number) => void
  onToggleStatus: (item: AdminUserListItem) => void
  onToggleVerification: (item: AdminUserListItem) => void
  onOpenDetail: (item: AdminUserListItem) => void
}

export function AdminUserTable({
  items,
  isLoading,
  isFetching,
  currentPage,
  totalPage,
  isTogglingStatus,
  isTogglingVerification,
  onPageChange,
  onToggleStatus,
  onToggleVerification,
  onOpenDetail,
}: AdminUserTableProps) {
  return (
    <AdminTableSection
      title={ADMIN_USER_CONTENT.tableTitle}
      isLoading={isLoading}
      isFetching={isFetching}
      hasItems={items.length > 0}
      currentPage={currentPage}
      totalPage={totalPage}
      previousPageLabel={ADMIN_USER_CONTENT.previousPageLabel}
      nextPageLabel={ADMIN_USER_CONTENT.nextPageLabel}
      emptyTitle={ADMIN_USER_CONTENT.emptyTitle}
      emptyDescription={ADMIN_USER_CONTENT.emptyDescription}
      emptyActionLabel={ADMIN_USER_CONTENT.emptyActionLabel}
      onPageChange={onPageChange}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{ADMIN_USER_CONTENT.columns.user}</TableHead>
            <TableHead>{ADMIN_USER_CONTENT.columns.role}</TableHead>
            <TableHead>{ADMIN_USER_CONTENT.columns.status}</TableHead>
            <TableHead>{ADMIN_USER_CONTENT.columns.verified}</TableHead>
            <TableHead>{ADMIN_USER_CONTENT.columns.createdAt}</TableHead>
            <TableHead>{ADMIN_USER_CONTENT.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isPending = isTogglingStatus || isTogglingVerification
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon size={20} style={{ color: 'var(--on-surface-variant)' }} />
                    <div>
                      <p>{item.displayName || ADMIN_COMMON_CONTENT.emptyValueLabel}</p>
                      <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                        <EnvelopeSimpleIcon size={12} />
                        {item.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getAdminUserRoleLabel(item.role)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'default' : 'secondary'} className={!item.isActive ? 'opacity-70' : undefined}>
                    {getAdminUserStatusLabel(item.isActive)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.isVerified ? (
                    <ShieldCheckIcon size={16} style={{ color: 'var(--color-green)' }} aria-label={ADMIN_USER_CONTENT.isVerifiedLabel} />
                  ) : (
                    <ShieldSlashIcon size={16} style={{ color: 'var(--on-surface-variant)' }} aria-label={ADMIN_USER_CONTENT.isNotVerifiedLabel} />
                  )}
                </TableCell>
                <TableCell>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onOpenDetail(item)}
                      title={ADMIN_USER_CONTENT.actions.viewDetail}
                    >
                      <GearIcon size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onToggleVerification(item)}
                      disabled={isPending}
                      title={
                        item.isVerified
                          ? ADMIN_USER_CONTENT.actions.toggleVerification
                          : ADMIN_USER_CONTENT.isVerifiedLabel
                      }
                    >
                      {item.isVerified ? <ShieldSlashIcon size={16} /> : <ShieldCheckIcon size={16} />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onToggleStatus(item)}
                      disabled={isPending}
                      title={ADMIN_USER_CONTENT.actions.toggleStatus}
                    >
                      {item.isActive ? <XCircleIcon size={16} /> : <ShieldCheckIcon size={16} />}
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