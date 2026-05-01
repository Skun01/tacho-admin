import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { JLPT_EXAM_CONTENT } from '@/constants/jlptAdmin'

interface JlptConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  variant?: 'destructive' | 'default'
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function JlptConfirmDialog({
  open,
  title,
  description,
  confirmLabel = JLPT_EXAM_CONTENT.confirmDeleteLabel,
  cancelLabel = JLPT_EXAM_CONTENT.confirmCancelLabel,
  isPending = false,
  variant = 'destructive',
  onOpenChange,
  onConfirm,
}: JlptConfirmDialogProps) {
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
          <Button type="button" variant={variant} onClick={onConfirm} disabled={isPending}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
