import { XCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import type { AdminUserListItem } from '@/types/adminUser'
import { getAdminUserRoleLabel } from '@/types/adminUser'

interface UserToggleStatusDialogProps {
  open: boolean
  item: AdminUserListItem | null
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UserToggleStatusDialog({
  open,
  item,
  isPending,
  onOpenChange,
  onConfirm,
}: UserToggleStatusDialogProps) {
  if (!item) return null

  const isDeactivating = item.isActive

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeactivating
              ? ADMIN_USER_CONTENT.dialogs.changeStatus.deactivate.title
              : ADMIN_USER_CONTENT.dialogs.changeStatus.activate.title}
          </DialogTitle>
          <DialogDescription>
            {isDeactivating
              ? ADMIN_USER_CONTENT.dialogs.changeStatus.deactivate.description
              : ADMIN_USER_CONTENT.dialogs.changeStatus.activate.description}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-container)' }}>
          <div className="flex items-center gap-3">
            <XCircleIcon
              size={20}
              style={{ color: isDeactivating ? 'var(--color-red)' : 'var(--color-green)' }}
            />
            <div>
              <p className="font-medium">{item.displayName || ADMIN_USER_CONTENT.columns.displayName}</p>
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.email}</p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                {ADMIN_USER_CONTENT.columns.role}: {getAdminUserRoleLabel(item.role)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {ADMIN_USER_CONTENT.dialogs.changeStatus.cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
            {isDeactivating
              ? ADMIN_USER_CONTENT.dialogs.changeStatus.deactivate.confirmLabel
              : ADMIN_USER_CONTENT.dialogs.changeStatus.activate.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}