import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CONVERSATION_SCENARIO_CONTENT } from '@/constants/conversationScenario'

interface ConversationScenarioDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scenarioName: string
  onConfirm: () => void
  isPending: boolean
}

export function ConversationScenarioDeleteDialog({
  open,
  onOpenChange,
  scenarioName,
  onConfirm,
  isPending,
}: ConversationScenarioDeleteDialogProps) {
  const content = CONVERSATION_SCENARIO_CONTENT.confirmDelete

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description(scenarioName)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {content.cancel}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            {content.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
