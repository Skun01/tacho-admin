import { useNavigate } from 'react-router'
import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon, ExportIcon } from '@phosphor-icons/react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { GrammarAdminFilters } from '@/components/grammar/GrammarAdminFilters'
import { GrammarAdminTable } from '@/components/grammar/GrammarAdminTable'
import { GrammarImportDialog } from '@/components/grammar/GrammarImportDialog'
import { ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { useAdminGrammarPageState } from '@/hooks/useAdminGrammarPageState'
import type { GrammarLevel, GrammarRegister, GrammarStatus } from '@/types/grammarAdmin'

export default function AdminGrammarPage() {
  const navigate = useNavigate()
  const state = useAdminGrammarPageState()

  const handleToggleLevel = (level: GrammarLevel) => {
    state.setLevelInput(state.levelInput === level ? undefined : level)
  }

  const handleToggleStatus = (status: GrammarStatus) => {
    state.setStatusInput(state.statusInput === status ? undefined : status)
  }

  const handleToggleRegister = (register: GrammarRegister) => {
    state.setRegisterInput(state.registerInput === register ? undefined : register)
  }

  return (
    <>
      <Helmet>
        <title>{ADMIN_GRAMMAR_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
              {ADMIN_GRAMMAR_CONTENT.heading}
            </h1>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              {ADMIN_GRAMMAR_CONTENT.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={state.handleDownloadTemplate}>
              <DownloadSimpleIcon size={16} />
              {ADMIN_GRAMMAR_CONTENT.actions.downloadTemplate}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleExportJson}>
              <ExportIcon size={16} />
              {ADMIN_GRAMMAR_CONTENT.actions.exportJson}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={state.handleOpenImport}>
              <UploadSimpleIcon size={16} />
              {ADMIN_GRAMMAR_CONTENT.actions.importJson}
            </Button>
            <Button type="button" size="sm" onClick={() => navigate('/admin/grammar/create')}>
              <PlusIcon size={16} />
              {ADMIN_GRAMMAR_CONTENT.createLabel}
            </Button>
          </div>
        </div>

        {/* Import dialog */}
        <GrammarImportDialog
          open={state.isImportDialogOpen}
          onOpenChange={state.handleCloseImport}
          onImported={state.handleCloseImport}
        />

        {/* Filters */}
        <GrammarAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          registerInput={state.registerInput}
          createdByMeInput={state.createdByMeInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={handleToggleLevel}
          onStatusToggle={handleToggleStatus}
          onRegisterToggle={handleToggleRegister}
          onCreatedByMeChange={state.setCreatedByMeInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        {/* Table */}
        <GrammarAdminTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          isDeleting={state.isDeleting}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={() => navigate('/admin/grammar/create')}
          onOpenEdit={(item) => navigate(`/admin/grammar/${item.id}/edit`)}
          onDelete={state.handleDelete}
        />
      </div>
    </>
  )
}
