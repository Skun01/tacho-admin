import { useState } from 'react'
import { SpinnerGapIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

  const resetState = () => {
    setFile(null)
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
      onImported()
      handleOpenChange(false)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_KANJI_CONTENT.toast.importCommitError))
    }
  }

  const hasInvalid = previewResult ? previewResult.invalidItems > 0 : false
  const canCommit = previewResult && !hasInvalid && payload

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-[720px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{C.title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-md border border-input px-3 py-2 text-sm"
            />
            {file && (
              <Badge variant="outline">
                {C.selectedFileLabel}: {file.name}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handlePreview}
              disabled={!file || previewMutation.isPending || commitMutation.isPending}
            >
              {previewMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {C.previewButtonLabel}
            </Button>
            <Button
              type="button"
              onClick={handleCommit}
              disabled={!canCommit || commitMutation.isPending}
              variant={canCommit ? 'default' : 'outline'}
            >
              {commitMutation.isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {C.commitButtonLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={commitMutation.isPending}>
              {C.closeButtonLabel}
            </Button>
          </div>

          {previewResult && (
            <Card>
              <CardHeader>
                <CardTitle>{C.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {C.totalItemsLabel}: {previewResult.totalItems}
                  </Badge>
                  <Badge variant="outline">
                    {C.validItemsLabel}: {previewResult.validItems}
                  </Badge>
                  <Badge variant="outline">
                    {C.invalidItemsLabel}: {previewResult.invalidItems}
                  </Badge>
                </div>

                {hasInvalid && (
                  <div className="flex items-center gap-2 rounded-md border border-yellow-400/60 bg-yellow-100/70 px-3 py-2 text-sm">
                    <WarningCircleIcon size={18} />
                    <span>{C.hasInvalidBlockLabel}</span>
                  </div>
                )}

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
                          <Badge variant={item.isValid ? 'default' : 'secondary'}>
                            {item.isValid ? C.statusValidLabel : C.statusInvalidLabel}
                          </Badge>
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
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
