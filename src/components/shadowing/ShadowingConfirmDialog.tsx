import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'

interface ShadowingConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ShadowingConfirmDialog({
  open,
  title,
  description,
  confirmLabel = SHADOWING_ADMIN_CONTENT.confirmDeleteLabel,
  cancelLabel = SHADOWING_ADMIN_CONTENT.confirmCancelLabel,
  isPending = false,
  onOpenChange,
  onConfirm,
}: ShadowingConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
