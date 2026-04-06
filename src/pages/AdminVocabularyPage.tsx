import { Helmet } from 'react-helmet-async'
import { PlusIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { VocabularyUpsertForm } from '@/components/content/VocabularyUpsertForm'
import { VocabularyAdminFilters } from '@/components/content/admin/VocabularyAdminFilters'
import { VocabularyAdminTable } from '@/components/content/admin/VocabularyAdminTable'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useAdminVocabularyPageState } from '@/hooks/useAdminVocabularyPageState'

export function AdminVocabularyPage() {
  const state = useAdminVocabularyPageState()

  return (
    <>
      <Helmet>
        <title>{ADMIN_VOCABULARY_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="font-heading-vn text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
            {ADMIN_VOCABULARY_CONTENT.heading}
          </h2>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_VOCABULARY_CONTENT.description}
          </p>
          <Button type="button" onClick={state.handleOpenCreate} className="mt-2">
            <PlusIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.createLabel}
          </Button>
        </header>

        <VocabularyUpsertForm
          open={state.formMode !== null}
          onOpenChange={(open) => {
            if (!open) {
              state.handleCloseForm()
            }
          }}
          mode={state.formMode ?? 'create'}
          initialData={state.editingItem}
          isLoadingDetail={state.isLoadingDetail}
          isSubmitting={state.isSubmitting}
          onSubmit={state.handleSubmitForm}
        />

        <VocabularyAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          createdByMeInput={state.createdByMeInput}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={(level) => state.setLevelInput((prev) => (prev === level ? undefined : level))}
          onStatusToggle={(status) => state.setStatusInput((prev) => (prev === status ? undefined : status))}
          onCreatedByMeChange={state.setCreatedByMeInput}
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
          onOpenEdit={state.handleOpenEdit}
          onDelete={state.handleDelete}
        />
      </section>
    </>
  )
}