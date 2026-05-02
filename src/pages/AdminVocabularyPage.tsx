import { Helmet } from 'react-helmet-async'
import { DownloadSimpleIcon, ExportIcon, PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { VocabularyAdminFilters } from '@/components/vocabulary/VocabularyAdminFilters'
import { VocabularyConfirmDialog } from '@/components/vocabulary/VocabularyConfirmDialog'
import { VocabularyImportDialog } from '@/components/vocabulary/VocabularyImportDialog'
import { VocabularyAdminTable } from '@/components/vocabulary/VocabularyAdminTable'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useAdminVocabularyPageState } from '@/hooks/useAdminVocabularyPageState'

export function AdminVocabularyPage() {
  const state = useAdminVocabularyPageState()
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>{ADMIN_VOCABULARY_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {ADMIN_VOCABULARY_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_VOCABULARY_CONTENT.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_VOCABULARY_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleExportJson}>
              <ExportIcon size={16} />
              {ADMIN_VOCABULARY_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_VOCABULARY_CONTENT.actions.importJson}
            </Button>
            <Button type="button" size="sm" onClick={() => navigate('/admin/vocabulary/create')}>
              <PlusIcon size={16} />
              {ADMIN_VOCABULARY_CONTENT.createLabel}
            </Button>
          </div>
        </div>
        <VocabularyImportDialog
          open={state.isImportDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseImport()
            }
          }}
          onImported={state.handleCloseImport}
        />

        <VocabularyAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          wordTypeInput={state.wordTypeInput}
          createdByMeInput={state.createdByMeInput}
          hasAudioInput={state.hasAudioInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={(level) => state.setLevelInput((prev) => (prev === level ? undefined : level))}
          onStatusToggle={(status) => state.setStatusInput((prev) => (prev === status ? undefined : status))}
          onWordTypeToggle={(wordType) => state.setWordTypeInput((prev) => (prev === wordType ? undefined : wordType))}
          onCreatedByMeChange={state.setCreatedByMeInput}
          onHasAudioChange={state.setHasAudioInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <VocabularyAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          isDeleting={state.isDeleting}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={() => navigate('/admin/vocabulary/create')}
          playingAudioUrl={state.playingAudioUrl}
          onPlayAudio={state.handlePlayAudio}
          onOpenEdit={(item) => navigate(`/admin/vocabulary/${item.id}/edit`)}
          onDelete={(item) => state.setPendingDeleteItem(item)}
        />
      </section>

      <VocabularyConfirmDialog
        open={Boolean(state.pendingDeleteItem)}
        itemTitle={state.pendingDeleteItem?.title}
        isPending={state.isDeleting}
        onOpenChange={(open) => {
          if (!open) state.setPendingDeleteItem(null)
        }}
        onConfirm={state.handleConfirmDelete}
      />
    </>
  )
}
