import { useState } from 'react'
import { SpinnerGapIcon, UploadSimpleIcon, CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import { useKanjiAdminImport } from '@/hooks/useKanjiAdminImport'
import { getImportIssueMessage } from '@/lib/importError'
import type { KanjiImportPayload, KanjiImportPreviewResult } from '@/types/kanjiAdmin'

interface KanjiImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: () => void
}

export function KanjiImportDialog({ open, onOpenChange, onImported }: KanjiImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [payload, setPayload] = useState<KanjiImportPayload | null>(null)
  const [previewResult, setPreviewResult] = useState<KanjiImportPreviewResult | null>(null)

  const { previewMutation, commitMutation, getApiErrorMessage } = useKanjiAdminImport()

  const C = ADMIN_KANJI_CONTENT.importDialog

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    setPreviewResult(null)
    setPayload(null)
  }

  const handlePreview = async () => {
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as KanjiImportPayload

      if (!parsed.items || !Array.isArray(parsed.items)) {
        gooeyToast.error(ADMIN_KANJI_CONTENT.toast.importInvalidJson)
        return
      }

      setPayload(parsed)
      const { data: response } = await previewMutation.mutateAsync(parsed)
      setPreviewResult(response.data)
    } catch {
      gooeyToast.error(ADMIN_KANJI_CONTENT.toast.importPreviewError)
    }
  }

  const handleCommit = async () => {
    if (!payload) return

    try {
      await commitMutation.mutateAsync(payload)
      gooeyToast.success(ADMIN_KANJI_CONTENT.toast.importCommitSuccess)
      setFile(null)
      setPayload(null)
      setPreviewResult(null)
      onImported()
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_KANJI_CONTENT.toast.importCommitError))
    }
  }

  const hasInvalid = previewResult ? previewResult.invalidItems > 0 : false
  const canCommit = previewResult && !hasInvalid && payload

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[720px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{C.title}</DialogTitle>
          <DialogDescription>{C.description}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {/* File input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{C.fileLabel}</label>
            <Input type="file" accept=".json" onChange={handleFileChange} />
            <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{C.fileHint}</p>
            {file && (
              <p className="text-xs font-medium">{C.selectedFileLabel}: {file.name}</p>
            )}
          </div>

          {/* Preview / Commit buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={!file || previewMutation.isPending}
            >
              {previewMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              <UploadSimpleIcon size={16} />
              {C.previewButtonLabel}
            </Button>
            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {C.commitButtonLabel}
            </Button>
          </div>

          {/* Preview summary */}
          {previewResult && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">{C.summaryTitle}</h4>
              <div className="flex gap-4 text-sm">
                <span>{C.totalItemsLabel}: <strong>{previewResult.totalItems}</strong></span>
                <span>{C.validItemsLabel}: <strong className="text-green-600">{previewResult.validItems}</strong></span>
                <span>{C.invalidItemsLabel}: <strong className="text-destructive">{previewResult.invalidItems}</strong></span>
              </div>

              {hasInvalid && (
                <p className="text-sm text-destructive">{C.hasInvalidBlockLabel}</p>
              )}

              {/* Preview table */}
              <h4 className="text-sm font-medium">{C.resultTitle}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">{C.columns.rowNumber}</TableHead>
                    <TableHead>{C.columns.title}</TableHead>
                    <TableHead className="w-20">{C.columns.kanji}</TableHead>
                    <TableHead className="w-28">{C.columns.status}</TableHead>
                    <TableHead>{C.columns.errors}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewResult.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{item.rowNumber ?? index + 1}</TableCell>
                      <TableCell className="text-sm">{item.title}</TableCell>
                      <TableCell className="text-center text-lg font-bold">{item.kanji}</TableCell>
                      <TableCell>
                        {item.isValid ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircleIcon size={14} />
                            {C.statusValidLabel}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 border border-destructive/20 bg-destructive/10 text-destructive">
                            <XCircleIcon size={14} />
                            {C.statusInvalidLabel}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.errors.length > 0 && (
                          <ul className="space-y-0.5">
                            {item.errors.map((err, errIndex) => (
                              <li key={errIndex} className="text-xs text-destructive">
                                {getImportIssueMessage(err)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!previewResult && (
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {C.emptyPreviewLabel}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
