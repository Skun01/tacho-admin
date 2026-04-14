import { Helmet } from 'react-helmet-async'
import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon, ExportIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { KanjiAdminFilters } from '@/components/kanji/KanjiAdminFilters'
import { KanjiAdminTable } from '@/components/kanji/KanjiAdminTable'
import { KanjiImportDialog } from '@/components/kanji/KanjiImportDialog'
import { KanjiUpsertForm } from '@/components/kanji/KanjiUpsertForm'
import { ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import { useAdminKanjiPageState } from '@/hooks/useAdminKanjiPageState'
import type { KanjiLevel, KanjiStatus } from '@/types/kanjiAdmin'

export default function AdminKanjiPage() {
  const state = useAdminKanjiPageState()

  const handleToggleLevel = (level: KanjiLevel) => {
    state.setLevelInput(state.levelInput === level ? undefined : level)
  }

  const handleToggleStatus = (status: KanjiStatus) => {
    state.setStatusInput(state.statusInput === status ? undefined : status)
  }

  return (
    <>
      <Helmet>
        <title>{ADMIN_KANJI_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {ADMIN_KANJI_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_KANJI_CONTENT.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleExportJson}>
              <ExportIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.importJson}
            </Button>
            <Button type="button" size="sm" onClick={state.handleOpenCreate}>
              <PlusIcon size={16} />
              {ADMIN_KANJI_CONTENT.createLabel}
            </Button>
          </div>
        </div>

        {/* Upsert modal */}
        <KanjiUpsertForm
          open={state.formMode !== null}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseForm()
            }
          }}
          mode={state.formMode ?? 'create'}
          initialData={state.editingItem}
          isSubmitting={state.isSubmitting}
          isLoadingDetail={state.isLoadingDetail}
          onSubmit={state.handleSubmitForm}
        />

        {/* Import dialog */}
        <KanjiImportDialog
          open={state.isImportDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseImport()
            }
          }}
          onImported={state.handleCloseImport}
        />

        {/* Filters */}
        <KanjiAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          strokeCountMinInput={state.strokeCountMinInput}
          strokeCountMaxInput={state.strokeCountMaxInput}
          radicalInput={state.radicalInput}
          createdByMeInput={state.createdByMeInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={handleToggleLevel}
          onStatusToggle={handleToggleStatus}
          onStrokeCountMinChange={state.setStrokeCountMinInput}
          onStrokeCountMaxChange={state.setStrokeCountMaxInput}
          onRadicalInputChange={state.setRadicalInput}
          onCreatedByMeChange={state.setCreatedByMeInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        {/* Table */}
        <KanjiAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          isDeleting={state.isDeleting}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={state.handleOpenCreate}
          onOpenEdit={state.handleOpenEdit}
          onDelete={state.handleDelete}
        />
      </section>
    </>
  )
}
