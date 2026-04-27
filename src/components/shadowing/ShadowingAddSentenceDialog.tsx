import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import type { AvailableSentenceResponse, ShadowingTopicDetailResponse } from '@/types/shadowingAdmin'

interface ShadowingAddSentenceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  isLoading: boolean
  isAttaching: boolean
  availableSentences: AvailableSentenceResponse[]
  topic: ShadowingTopicDetailResponse
  onAttachSentence: (sentenceId: string, position: number) => void
}

export function ShadowingAddSentenceDialog({
  open,
  onOpenChange,
  searchQuery,
  onSearchQueryChange,
  isLoading,
  isAttaching,
  availableSentences,
  topic,
  onAttachSentence,
}: ShadowingAddSentenceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{SHADOWING_ADMIN_CONTENT.addSentenceDialogTitle}</DialogTitle>
          <DialogDescription>{SHADOWING_ADMIN_CONTENT.addSentenceDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={SHADOWING_ADMIN_CONTENT.searchAvailableSentencesPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
          <div className="rounded-lg border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.sentenceTextColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.sentenceMeaningColumn}</TableHead>
                  <TableHead>{SHADOWING_ADMIN_CONTENT.sentenceLevelColumn}</TableHead>
                  <TableHead className="text-right">{SHADOWING_ADMIN_CONTENT.columns.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : availableSentences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      {SHADOWING_ADMIN_CONTENT.emptyAvailableSentencesLabel}
                    </TableCell>
                  </TableRow>
                ) : (
                  availableSentences.map((sentence) => (
                    <TableRow key={sentence.sentenceId}>
                      <TableCell className="font-medium">{sentence.text}</TableCell>
                      <TableCell>{sentence.meaning}</TableCell>
                      <TableCell>
                        {sentence.level ? <Badge variant="outline">{sentence.level}</Badge> : SHADOWING_ADMIN_CONTENT.noneSymbol}
                      </TableCell>
                      <TableCell className="text-right">
                        {sentence.isAttached ? (
                          <Badge variant="secondary">{SHADOWING_ADMIN_CONTENT.alreadyAttachedLabel}</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const nextPosition = topic.sentences.length > 0
                                ? Math.max(...topic.sentences.map((s) => s.position)) + 1
                                : 1
                              onAttachSentence(sentence.sentenceId, nextPosition)
                            }}
                            disabled={isAttaching}
                          >
                            {SHADOWING_ADMIN_CONTENT.attachLabel}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {SHADOWING_ADMIN_CONTENT.cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
