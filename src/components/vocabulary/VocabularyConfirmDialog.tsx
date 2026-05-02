import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface VocabularyConfirmDialogProps {
  open: boolean
  itemTitle?: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function VocabularyConfirmDialog({
  open,
  itemTitle,
  isPending = false,
  onOpenChange,
  onConfirm,
}: VocabularyConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa từ vựng?</DialogTitle>
          <DialogDescription>
            {itemTitle
              ? `Xóa từ vựng "${itemTitle}" khỏi hệ thống. Hành động này không thể hoàn tác.`
              : 'Xóa từ vựng khỏi hệ thống. Hành động này không thể hoàn tác.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}