import { useRef, useState } from 'react'
import {
  SpinnerGapIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
        setSelectedFile(null)
        setPayload(null)
        setPreviewResult(null)
        onImported()
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

  const handleClose = () => {
    setSelectedFile(null)
    setPayload(null)
    setPreviewResult(null)
    onOpenChange(false)
  }

  const canCommit = previewResult && previewResult.isValid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[700px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{JLPT_EXAM_CONTENT.importDialog.title}</DialogTitle>
          <DialogDescription>{JLPT_EXAM_CONTENT.importDialog.description}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {/* File input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{JLPT_EXAM_CONTENT.importDialog.fileLabel}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_EXAM_CONTENT.importDialog.fileHint}
            </p>
          </div>

          {selectedFile && (
            <p className="text-sm">
              {JLPT_EXAM_CONTENT.importDialog.selectedFileLabel}: <strong>{selectedFile.name}</strong>
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={!payload || previewMutation.isPending}
            >
              {previewMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              <UploadSimpleIcon size={16} />
              {JLPT_EXAM_CONTENT.importDialog.previewButtonLabel}
            </Button>

            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {JLPT_EXAM_CONTENT.importDialog.commitButtonLabel}
            </Button>

            <Button type="button" variant="outline" onClick={handleClose}>
              {JLPT_EXAM_CONTENT.importDialog.closeButtonLabel}
            </Button>
          </div>

          {/* Preview results */}
          {previewResult ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{JLPT_EXAM_CONTENT.importDialog.summaryTitle}</h4>
              <div className="flex flex-col gap-2 rounded-md border p-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  <span>{JLPT_LEVEL_LABELS[previewResult.item.level]}</span>
                  <span>sections: {previewResult.item.sectionsCount}</span>
                  <span>nhóm: {previewResult.item.questionGroupsCount}</span>
                  <span>câu hỏi: {previewResult.item.questionsCount}</span>
                  <span>đáp án: {previewResult.item.optionsCount}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-green-600">
                  {JLPT_EXAM_CONTENT.importDialog.statusValidLabel}: {previewResult.item.isValid ? '✓' : '✗'}
                </span>
                <span className="text-red-600">
                  {previewResult.errorCount} {JLPT_EXAM_CONTENT.importDialog.errorCountLabel}
                </span>
                {previewResult.warningCount > 0 && (
                  <span className="text-yellow-600">
                    {previewResult.warningCount} {JLPT_EXAM_CONTENT.importDialog.warningCountLabel}
                  </span>
                )}
              </div>

              {!previewResult.isValid && (
                <p className="text-sm text-red-600">{JLPT_EXAM_CONTENT.importDialog.hasInvalidBlockLabel}</p>
              )}

              {(previewResult.item.errors.length > 0 || previewResult.item.warnings.length > 0) && (
                <>
                  <h4 className="text-sm font-semibold">{JLPT_EXAM_CONTENT.importDialog.resultTitle}</h4>
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
                </>
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_EXAM_CONTENT.importDialog.emptyPreviewLabel}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

