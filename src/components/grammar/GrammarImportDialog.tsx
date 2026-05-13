import { useRef, useState } from 'react'
import { SpinnerGapIcon, WarningCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
      onImported()
      handleOpenChange(false)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.importCommitError))
    }
  }

  const canCommit = previewResult && previewResult.invalidItems === 0 && previewResult.validItems > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[700px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{ADMIN_GRAMMAR_CONTENT.importDialog.title}</DialogTitle>
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
                {ADMIN_GRAMMAR_CONTENT.importDialog.selectedFileLabel}: {selectedFile.name}
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
              {ADMIN_GRAMMAR_CONTENT.importDialog.previewButtonLabel}
            </Button>

            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
              variant={canCommit ? 'default' : 'outline'}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {ADMIN_GRAMMAR_CONTENT.importDialog.commitButtonLabel}
            </Button>

            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={commitMutation.isPending}>
              {ADMIN_GRAMMAR_CONTENT.importDialog.closeButtonLabel}
            </Button>
          </div>

          {previewResult && (
            <Card>
              <CardHeader>
                <CardTitle>{ADMIN_GRAMMAR_CONTENT.importDialog.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {ADMIN_GRAMMAR_CONTENT.importDialog.totalItemsLabel}: {previewResult.totalItems}
                  </Badge>
                  <Badge variant="outline">
                    {ADMIN_GRAMMAR_CONTENT.importDialog.validItemsLabel}: {previewResult.validItems}
                  </Badge>
                  <Badge variant="outline">
                    {ADMIN_GRAMMAR_CONTENT.importDialog.invalidItemsLabel}: {previewResult.invalidItems}
                  </Badge>
                </div>

                {previewResult.invalidItems > 0 && (
                  <div className="flex items-center gap-2 rounded-md border border-yellow-400/60 bg-yellow-100/70 px-3 py-2 text-sm">
                    <WarningCircleIcon size={18} />
                    <span>{ADMIN_GRAMMAR_CONTENT.importDialog.hasInvalidBlockLabel}</span>
                  </div>
                )}

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
                          <Badge variant={item.isValid ? 'default' : 'secondary'}>
                            {item.isValid
                              ? ADMIN_GRAMMAR_CONTENT.importDialog.statusValidLabel
                              : ADMIN_GRAMMAR_CONTENT.importDialog.statusInvalidLabel}
                          </Badge>
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
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
