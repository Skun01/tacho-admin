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
        <header className="space-y-2">
          <h2 className="font-heading-vn text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
            {ADMIN_KANJI_CONTENT.heading}
          </h2>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_KANJI_CONTENT.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" onClick={state.handleExportJson}>
              <ExportIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_KANJI_CONTENT.actions.importJson}
            </Button>
            <Button type="button" onClick={state.handleOpenCreate}>
              <PlusIcon size={16} />
              {ADMIN_KANJI_CONTENT.createLabel}
            </Button>
          </div>
        </header>

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
