import { useMemo, useState } from 'react'
import { CheckCircleIcon, SpinnerGapIcon, WarningCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useVocabularyAdminImport } from '@/hooks/useVocabularyAdminImport'
import { parseJsonFile } from '@/lib/fileJson'
import { getImportIssueMessage } from '@/lib/importError'
import type { VocabularyImportPayload } from '@/types/vocabularyAdmin'

interface VocabularyImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: () => void
}

export function VocabularyImportDialog({ open, onOpenChange, onImported }: VocabularyImportDialogProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [payload, setPayload] = useState<VocabularyImportPayload | null>(null)
  const [previewData, setPreviewData] = useState<ReturnType<typeof useVocabularyAdminImport>['previewMutation']['data'] | null>(null)
  const { previewMutation, commitMutation, getApiErrorMessage } = useVocabularyAdminImport()

  const parsedPreview = previewData?.data.data
  const hasInvalidItems = (parsedPreview?.invalidItems ?? 0) > 0
  const canCommit = Boolean(payload && parsedPreview && !hasInvalidItems && !commitMutation.isPending)

  const rows = useMemo(() => parsedPreview?.items ?? [], [parsedPreview?.items])

  const resetState = () => {
    setFileName(null)
    setPayload(null)
    setPreviewData(null)
    previewMutation.reset()
    commitMutation.reset()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState()
    }
    onOpenChange(nextOpen)
  }

  const handleFileChange = async (file?: File) => {
    if (!file) return

    try {
      const parsed = await parseJsonFile<VocabularyImportPayload>(file)
      if (!parsed || !Array.isArray(parsed.items)) {
        gooeyToast.error(ADMIN_VOCABULARY_CONTENT.toast.importInvalidJson)
        return
      }
      setPayload(parsed)
      setFileName(file.name)
      setPreviewData(null)
      previewMutation.reset()
      commitMutation.reset()
    } catch {
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.toast.importReadFailed)
    }
  }

  const handlePreview = async () => {
    if (!payload) {
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.toast.importInvalidJson)
      return
    }

    try {
      const response = await previewMutation.mutateAsync(payload)
      setPreviewData(response)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_VOCABULARY_CONTENT.toast.importPreviewError))
    }
  }

  const handleCommit = async () => {
    if (!payload || !parsedPreview || hasInvalidItems) return

    try {
      await commitMutation.mutateAsync(payload)
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.importCommitSuccess)
      onImported()
      handleOpenChange(false)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_VOCABULARY_CONTENT.toast.importCommitError))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[1080px]">
        <DialogHeader>
          <DialogTitle>{ADMIN_VOCABULARY_CONTENT.importDialog.title}</DialogTitle>
          <DialogDescription>{ADMIN_VOCABULARY_CONTENT.importDialog.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.importDialog.fileLabel}</p>
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
              className="block w-full cursor-pointer rounded-md border border-input px-3 py-2 text-sm"
            />
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_VOCABULARY_CONTENT.importDialog.fileHint}
            </p>
            {fileName && (
              <Badge variant="outline">
                {ADMIN_VOCABULARY_CONTENT.importDialog.selectedFileLabel}: {fileName}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handlePreview} disabled={!payload || previewMutation.isPending || commitMutation.isPending}>
              {previewMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {ADMIN_VOCABULARY_CONTENT.importDialog.previewButtonLabel}
            </Button>
            <Button type="button" onClick={handleCommit} disabled={!canCommit} variant={canCommit ? 'default' : 'outline'}>
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {ADMIN_VOCABULARY_CONTENT.importDialog.commitButtonLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={commitMutation.isPending}>
              {ADMIN_VOCABULARY_CONTENT.importDialog.closeButtonLabel}
            </Button>
          </div>

          {parsedPreview ? (
            <Card>
              <CardHeader>
                <CardTitle>{ADMIN_VOCABULARY_CONTENT.importDialog.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {ADMIN_VOCABULARY_CONTENT.importDialog.totalItemsLabel}: {parsedPreview.totalItems}
                  </Badge>
                  <Badge variant="outline">
                    {ADMIN_VOCABULARY_CONTENT.importDialog.validItemsLabel}: {parsedPreview.validItems}
                  </Badge>
                  <Badge variant="outline">
                    {ADMIN_VOCABULARY_CONTENT.importDialog.invalidItemsLabel}: {parsedPreview.invalidItems}
                  </Badge>
                </div>

                {hasInvalidItems && (
                  <div className="flex items-center gap-2 rounded-md border border-yellow-400/60 bg-yellow-100/70 px-3 py-2 text-sm">
                    <WarningCircleIcon size={18} />
                    <span>{ADMIN_VOCABULARY_CONTENT.importDialog.hasInvalidBlockLabel}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">{ADMIN_VOCABULARY_CONTENT.importDialog.resultTitle}</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.rowNumber}</TableHead>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.title}</TableHead>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.writing}</TableHead>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.status}</TableHead>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.errors}</TableHead>
                        <TableHead>{ADMIN_VOCABULARY_CONTENT.importDialog.columns.warnings}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((item) => (
                        <TableRow key={`${item.rowNumber ?? 'null'}-${item.writing}`}>
                          <TableCell>{item.rowNumber ?? '-'}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={item.title}>
                            {item.title}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={item.writing}>
                            {item.writing}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.isValid ? 'default' : 'secondary'}>
                              {item.isValid
                                ? ADMIN_VOCABULARY_CONTENT.importDialog.statusValidLabel
                                : ADMIN_VOCABULARY_CONTENT.importDialog.statusInvalidLabel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {item.errors.length > 0 ? (
                                item.errors.map((errorCode) => (
                                  <p key={errorCode} className="flex items-start gap-1 text-xs">
                                    <XCircleIcon size={14} className="mt-0.5 shrink-0" />
                                    <span>{getImportIssueMessage(errorCode)}</span>
                                  </p>
                                ))
                              ) : (
                                <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                                  -
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {item.warnings.length > 0 ? (
                                item.warnings.map((warningCode) => (
                                  <p key={warningCode} className="flex items-start gap-1 text-xs">
                                    <WarningCircleIcon size={14} className="mt-0.5 shrink-0" />
                                    <span>{getImportIssueMessage(warningCode)}</span>
                                  </p>
                                ))
                              ) : (
                                <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                                  <CheckCircleIcon size={14} />
                                  <span>-</span>
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border border-dashed px-4 py-3 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_VOCABULARY_CONTENT.importDialog.emptyPreviewLabel}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
