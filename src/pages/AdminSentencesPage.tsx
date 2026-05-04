import { Helmet } from '@dr.pogodin/react-helmet'
import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon, ExportIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SentenceUpsertForm } from '@/components/sentence/SentenceUpsertForm'
import { SentenceAdminFilters } from '@/components/sentence/SentenceAdminFilters'
import { SentenceAdminTable } from '@/components/sentence/SentenceAdminTable'
import { SentenceImportDialog } from '@/components/sentence/SentenceImportDialog'
import { ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import { useAdminSentencesPageState } from '@/hooks/useAdminSentencesPageState'

export function AdminSentencesPage() {
  const state = useAdminSentencesPageState()

  return (
    <>
      <Helmet>
        <title>{ADMIN_SENTENCE_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {ADMIN_SENTENCE_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_SENTENCE_CONTENT.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleExportJson}>
              <ExportIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.importJson}
            </Button>
            <Button type="button" size="sm" onClick={state.handleOpenCreate}>
              <PlusIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.createLabel}
            </Button>
          </div>
        </div>

        <SentenceUpsertForm
          open={state.formMode !== null}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseForm()
            }
          }}
          mode={state.formMode ?? 'create'}
          initialData={state.editingItem}
          isSubmitting={state.isSubmitting}
          onSubmit={state.handleSubmitForm}
        />
        <SentenceImportDialog
          open={state.isImportDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseImport()
            }
          }}
          onImported={state.handleCloseImport}
        />

        <SentenceAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          createdByMeInput={state.createdByMeInput}
          hasAudioInput={state.hasAudioInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={(level) => state.setLevelInput((prev) => (prev === level ? undefined : level))}
          onCreatedByMeChange={state.setCreatedByMeInput}
          onHasAudioChange={state.setHasAudioInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <SentenceAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          isDeleting={state.isDeleting}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={state.handleOpenCreate}
          playingAudioUrl={state.playingAudioUrl}
          onOpenEdit={state.handleOpenEdit}
          onDelete={state.handleDelete}
          onPlayAudio={state.handlePlayAudio}
        />
      </section>
    </>
  )
}
