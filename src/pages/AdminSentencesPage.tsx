import { Helmet } from 'react-helmet-async'
import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
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
        <header className="space-y-2">
          <h2 className="font-heading-vn text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
            {ADMIN_SENTENCE_CONTENT.heading}
          </h2>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_SENTENCE_CONTENT.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" onClick={state.handleExportJson}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.actions.importJson}
            </Button>
            <Button type="button" onClick={state.handleOpenCreate}>
              <PlusIcon size={16} />
              {ADMIN_SENTENCE_CONTENT.createLabel}
            </Button>
          </div>
        </header>

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
