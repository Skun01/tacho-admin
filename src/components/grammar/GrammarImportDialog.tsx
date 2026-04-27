import { useRef, useState } from 'react'
import { CheckCircleIcon, SpinnerGapIcon, UploadSimpleIcon, WarningCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { useGrammarAdminImport } from '@/hooks/useGrammarAdminImport'
import { getImportIssueMessage } from '@/lib/importError'
import type { GrammarImportPayload, GrammarImportPreviewResult } from '@/types/grammarAdmin'

interface GrammarImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: () => void
}

export function GrammarImportDialog({ open, onOpenChange, onImported }: GrammarImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [payload, setPayload] = useState<GrammarImportPayload | null>(null)
  const [previewResult, setPreviewResult] = useState<GrammarImportPreviewResult | null>(null)

  const { previewMutation, commitMutation, getApiErrorMessage } = useGrammarAdminImport()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setPreviewResult(null)
    setPayload(null)

    if (!file) return

    const reader = new FileReader()
    reader.onload = (readEvent) => {
      try {
        const parsed = JSON.parse(readEvent.target?.result as string) as GrammarImportPayload
        if (!parsed.items || !Array.isArray(parsed.items)) {
          gooeyToast.error(ADMIN_GRAMMAR_CONTENT.toast.importInvalidJson)
          return
        }
        setPayload(parsed)
      } catch {
        gooeyToast.error(ADMIN_GRAMMAR_CONTENT.toast.importInvalidJson)
      }
    }
    reader.onerror = () => {
      gooeyToast.error(ADMIN_GRAMMAR_CONTENT.toast.importReadFailed)
    }
    reader.readAsText(file)
  }

  const handlePreview = async () => {
    if (!payload) return
    try {
      const { data } = await previewMutation.mutateAsync(payload)
      setPreviewResult(data.data)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.importPreviewError))
    }
  }

  const handleCommit = async () => {
    if (!payload) return
    try {
      await commitMutation.mutateAsync(payload)
      gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.importCommitSuccess)
      setSelectedFile(null)
      setPayload(null)
      setPreviewResult(null)
      onImported()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.importCommitError))
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPayload(null)
    setPreviewResult(null)
    onOpenChange(false)
  }

  const canCommit = previewResult && previewResult.invalidItems === 0 && previewResult.validItems > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[700px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{ADMIN_GRAMMAR_CONTENT.importDialog.title}</DialogTitle>
          <DialogDescription>{ADMIN_GRAMMAR_CONTENT.importDialog.description}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {/* File input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{ADMIN_GRAMMAR_CONTENT.importDialog.fileLabel}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_GRAMMAR_CONTENT.importDialog.fileHint}
            </p>
          </div>

          {selectedFile && (
            <p className="text-sm">
              {ADMIN_GRAMMAR_CONTENT.importDialog.selectedFileLabel}: <strong>{selectedFile.name}</strong>
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
              {ADMIN_GRAMMAR_CONTENT.importDialog.previewButtonLabel}
            </Button>

            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {ADMIN_GRAMMAR_CONTENT.importDialog.commitButtonLabel}
            </Button>

            <Button type="button" variant="outline" onClick={handleClose}>
              {ADMIN_GRAMMAR_CONTENT.importDialog.closeButtonLabel}
            </Button>
          </div>

          {/* Preview results */}
          {previewResult ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{ADMIN_GRAMMAR_CONTENT.importDialog.summaryTitle}</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>{ADMIN_GRAMMAR_CONTENT.importDialog.totalItemsLabel}: {previewResult.totalItems}</span>
                <span className="text-green-600">{ADMIN_GRAMMAR_CONTENT.importDialog.validItemsLabel}: {previewResult.validItems}</span>
                <span className="text-red-600">{ADMIN_GRAMMAR_CONTENT.importDialog.invalidItemsLabel}: {previewResult.invalidItems}</span>
              </div>

              {previewResult.invalidItems > 0 && (
                <p className="text-sm text-red-600">{ADMIN_GRAMMAR_CONTENT.importDialog.hasInvalidBlockLabel}</p>
              )}

              <h4 className="text-sm font-semibold">{ADMIN_GRAMMAR_CONTENT.importDialog.resultTitle}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">{ADMIN_GRAMMAR_CONTENT.importDialog.columns.rowNumber}</TableHead>
                    <TableHead>{ADMIN_GRAMMAR_CONTENT.importDialog.columns.title}</TableHead>
                    <TableHead className="w-[90px]">{ADMIN_GRAMMAR_CONTENT.importDialog.columns.status}</TableHead>
                    <TableHead>{ADMIN_GRAMMAR_CONTENT.importDialog.columns.errors}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewResult.items.map((item) => (
                    <TableRow key={item.rowNumber}>
                      <TableCell>{item.rowNumber}</TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        {item.isValid ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircleIcon size={12} />
                            {ADMIN_GRAMMAR_CONTENT.importDialog.statusValidLabel}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-red-600">
                            <XCircleIcon size={12} />
                            {ADMIN_GRAMMAR_CONTENT.importDialog.statusInvalidLabel}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.errors.length > 0 && (
                          <div className="space-y-0.5">
                            {item.errors.map((err, i) => (
                              <div key={i} className="flex items-start gap-1 text-xs text-red-600">
                                <XCircleIcon size={12} className="mt-0.5 shrink-0" />
                                <span>{getImportIssueMessage(err)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.warnings.length > 0 && (
                          <div className="space-y-0.5">
                            {item.warnings.map((warn, i) => (
                              <div key={i} className="flex items-start gap-1 text-xs text-yellow-600">
                                <WarningCircleIcon size={12} className="mt-0.5 shrink-0" />
                                <span>{getImportIssueMessage(warn)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_GRAMMAR_CONTENT.importDialog.emptyPreviewLabel}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
