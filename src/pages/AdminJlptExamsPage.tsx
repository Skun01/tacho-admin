import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { ExamImportDialog } from '@/components/jlpt/ExamImportDialog'
import { JlptExamAdminFilters } from '@/components/jlpt/JlptExamAdminFilters'
import { JlptExamAdminTable } from '@/components/jlpt/JlptExamAdminTable'
import { JlptConfirmDialog } from '@/components/jlpt/JlptConfirmDialog'
import { JlptExamFormDialog } from '@/components/jlpt/JlptExamFormDialog'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { JLPT_EXAM_CONTENT } from '@/constants/jlptAdmin'
import { useAdminJlptExamsPageState } from '@/hooks/useAdminJlptExamsPageState'
import { useJlptAdminMutations } from '@/hooks/useJlptAdminMutations'
import type { JlptLevel } from '@/types/jlptAdmin'

export function AdminJlptExamsPage() {
  const state = useAdminJlptExamsPageState()
  const [pendingDeleteExamId, setPendingDeleteExamId] = useState<string | null>(null)
  const { createExamMutation, getApiErrorMessage } = useJlptAdminMutations()

  async function handleCreateExam(payload: {
    title: string
    level: JlptLevel
    totalDurationMinutes: number
  }) {
    try {
      await createExamMutation.mutateAsync(payload)
      gooeyToast.success(JLPT_EXAM_CONTENT.examCreatedSuccess)
      state.handleCloseCreate()
    } catch (error) {
      gooeyToast.error(
        getApiErrorMessage(error, JLPT_EXAM_CONTENT.createExamFailedFallback),
      )
    }
  }

  return (
    <>
      <Helmet>
        <title>{JLPT_EXAM_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {JLPT_EXAM_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {JLPT_EXAM_CONTENT.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {JLPT_EXAM_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadImportGuide}>
              <DownloadSimpleIcon size={16} />
              {JLPT_EXAM_CONTENT.actions.importGuide}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {JLPT_EXAM_CONTENT.actions.importExam}
            </Button>
            <Button type="button" size="sm" onClick={state.handleOpenCreate}>
              <PlusIcon size={16} />
              {JLPT_EXAM_CONTENT.createLabel}
            </Button>
          </div>
        </div>

        <JlptExamFormDialog
          mode="create"
          open={state.isCreateDialogOpen}
          onOpenChange={(open) => {
            if (!open) state.handleCloseCreate()
          }}
          isPending={createExamMutation.isPending}
          onSubmit={handleCreateExam}
        />

        <ExamImportDialog
          open={state.isImportDialogOpen}
          onOpenChange={(open) => {
            if (!open) state.handleCloseImport()
          }}
          onImported={state.handleCloseImport}
        />

        <JlptExamAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelChange={state.setLevelInput}
          onStatusChange={state.setStatusInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <JlptExamAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={state.handleOpenCreate}
          onOpenDetail={(item) => state.navigate(`/admin/jlpt/exams/${item.id}`)}
          onDelete={(item) => setPendingDeleteExamId(item.id)}
          onExportExam={(item) => state.handleExportExam(item.id)}
        />

        <JlptConfirmDialog
          open={Boolean(pendingDeleteExamId)}
          title={JLPT_EXAM_CONTENT.deleteExamConfirmTitle}
          description={JLPT_EXAM_CONTENT.deleteExamConfirmMessage}
          isPending={state.isDeleting}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteExamId(null)
          }}
          onConfirm={() => {
            if (!pendingDeleteExamId) return
            void state.handleDelete(pendingDeleteExamId).finally(() => setPendingDeleteExamId(null))
          }}
        />
      </section>
    </>
  )
}
