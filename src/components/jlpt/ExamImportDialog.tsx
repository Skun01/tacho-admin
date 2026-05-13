import { useRef, useState } from 'react'
import {
  SpinnerGapIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { JLPT_EXAM_CONTENT, JLPT_LEVEL_LABELS } from '@/constants/jlptAdmin'
import { useExamAdminImport } from '@/hooks/useExamAdminImport'
import { getImportIssueMessage } from '@/lib/importError'
import type { ExamImportPreviewResult, ImportExamRequest } from '@/types/jlptAdmin'

interface ExamImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: () => void
}

export function ExamImportDialog({ open, onOpenChange, onImported }: ExamImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [payload, setPayload] = useState<ImportExamRequest | null>(null)
  const [previewResult, setPreviewResult] = useState<ExamImportPreviewResult | null>(null)

  const { previewMutation, commitMutation, getApiErrorMessage } = useExamAdminImport()

  const resetState = () => {
    setSelectedFile(null)
    setPayload(null)
    setPreviewResult(null)
    previewMutation.reset()
    commitMutation.reset()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState()
    }
    onOpenChange(nextOpen)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setPreviewResult(null)

    if (!file) return

    const reader = new FileReader()
    reader.onload = (readEvent) => {
      try {
        const parsed = JSON.parse(readEvent.target?.result as string) as ImportExamRequest
        if (!parsed.title || !parsed.level || !parsed.sections) {
          gooeyToast.error(JLPT_EXAM_CONTENT.importDialog.importInvalidJson)
          return
        }
        setPayload(parsed)
      } catch {
        gooeyToast.error(JLPT_EXAM_CONTENT.importDialog.importInvalidJson)
      }
    }
    reader.onerror = () => {
      gooeyToast.error(JLPT_EXAM_CONTENT.importDialog.importReadFailed)
    }
    reader.readAsText(file)
  }

  const handlePreview = async () => {
    if (!payload) return
    try {
      const { data } = await previewMutation.mutateAsync(payload)
      setPreviewResult(data.data)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.importDialog.previewFailedFallback))
    }
  }

  const handleCommit = async () => {
    if (!payload) return
    try {
      const { data } = await commitMutation.mutateAsync(payload)
      const result = data.data
      if (result.isSuccess) {
        gooeyToast.success(JLPT_EXAM_CONTENT.importDialog.commitSuccess)
        onImported()
        handleOpenChange(false)
      } else {
        gooeyToast.error(
          result.errors.length > 0
            ? result.errors.map((e) => getImportIssueMessage(e)).join('; ')
            : JLPT_EXAM_CONTENT.importDialog.commitFailedFallback,
        )
      }
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.importDialog.commitFailedFallback))
    }
  }

  const canCommit = previewResult && previewResult.isValid

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[700px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{JLPT_EXAM_CONTENT.importDialog.title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-md border border-input px-3 py-2 text-sm"
            />
            {selectedFile && (
              <Badge variant="outline">
                {JLPT_EXAM_CONTENT.importDialog.selectedFileLabel}: {selectedFile.name}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handlePreview}
              disabled={!payload || previewMutation.isPending || commitMutation.isPending}
            >
              {previewMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {JLPT_EXAM_CONTENT.importDialog.previewButtonLabel}
            </Button>

            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
              variant={canCommit ? 'default' : 'outline'}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {JLPT_EXAM_CONTENT.importDialog.commitButtonLabel}
            </Button>

            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={commitMutation.isPending}>
              {JLPT_EXAM_CONTENT.importDialog.closeButtonLabel}
            </Button>
          </div>

          {previewResult && (
            <Card>
              <CardHeader>
                <CardTitle>{JLPT_EXAM_CONTENT.importDialog.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  <span>{JLPT_LEVEL_LABELS[previewResult.item.level]}</span>
                  <span>sections: {previewResult.item.sectionsCount}</span>
                  <span>nhóm: {previewResult.item.questionGroupsCount}</span>
                  <span>câu hỏi: {previewResult.item.questionsCount}</span>
                  <span>đáp án: {previewResult.item.optionsCount}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={previewResult.item.isValid ? 'success' : 'destructive'}>
                    {previewResult.item.isValid
                      ? JLPT_EXAM_CONTENT.importDialog.statusValidLabel
                      : JLPT_EXAM_CONTENT.importDialog.statusInvalidLabel}
                  </Badge>
                  {previewResult.errorCount > 0 && (
                    <Badge variant="destructive">
                      {previewResult.errorCount} {JLPT_EXAM_CONTENT.importDialog.errorCountLabel}
                    </Badge>
                  )}
                  {previewResult.warningCount > 0 && (
                    <Badge variant="warning">
                      {previewResult.warningCount} {JLPT_EXAM_CONTENT.importDialog.warningCountLabel}
                    </Badge>
                  )}
                </div>

                {!previewResult.isValid && (
                  <div className="flex items-center gap-2 rounded-md border border-yellow-400/60 bg-yellow-100/70 px-3 py-2 text-sm">
                    <WarningCircleIcon size={18} />
                    <span>{JLPT_EXAM_CONTENT.importDialog.hasInvalidBlockLabel}</span>
                  </div>
                )}

                {(previewResult.item.errors.length > 0 || previewResult.item.warnings.length > 0) && (
                  <ScrollArea className="max-h-[240px] rounded-md border">
                    <div className="space-y-1 p-2">
                      {previewResult.item.errors.map((err, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-sm text-red-600">
                          <XCircleIcon size={14} className="mt-0.5 shrink-0" />
                          <span>{getImportIssueMessage(err)}</span>
                        </div>
                      ))}
                      {previewResult.item.warnings.map((warn, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-sm text-yellow-600">
                          <WarningCircleIcon size={14} className="mt-0.5 shrink-0" />
                          <span>{getImportIssueMessage(warn)}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

