import { ShieldCheckIcon, ShieldSlashIcon } from '@phosphor-icons/react'
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

interface UserToggleVerificationDialogProps {
  open: boolean
  item: AdminUserListItem | null
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UserToggleVerificationDialog({
  open,
  item,
  isPending,
  onOpenChange,
  onConfirm,
}: UserToggleVerificationDialogProps) {
  if (!item) return null

  const isVerifying = !item.isVerified

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isVerifying
              ? ADMIN_USER_CONTENT.dialogs.changeVerification.verify.title
              : ADMIN_USER_CONTENT.dialogs.changeVerification.unverify.title}
          </DialogTitle>
          <DialogDescription>
            {isVerifying
              ? ADMIN_USER_CONTENT.dialogs.changeVerification.verify.description
              : ADMIN_USER_CONTENT.dialogs.changeVerification.unverify.description}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-container)' }}>
          <div className="flex items-center gap-3">
            {isVerifying
              ? <ShieldCheckIcon size={20} style={{ color: 'var(--color-green)' }} />
              : <ShieldSlashIcon size={20} style={{ color: 'var(--color-orange)' }} />}
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
            {ADMIN_USER_CONTENT.dialogs.changeVerification.cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
            {isVerifying
              ? ADMIN_USER_CONTENT.dialogs.changeVerification.verify.confirmLabel
              : ADMIN_USER_CONTENT.dialogs.changeVerification.unverify.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}