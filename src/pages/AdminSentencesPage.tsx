import { Helmet } from 'react-helmet-async'
import { PlusIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SentenceUpsertForm } from '@/components/content/SentenceUpsertForm'
import { SentenceAdminFilters } from '@/components/content/admin/SentenceAdminFilters'
import { SentenceAdminTable } from '@/components/content/admin/SentenceAdminTable'
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
          <Button type="button" onClick={state.handleOpenCreate} className="mt-2">
            <PlusIcon size={16} />
            {ADMIN_SENTENCE_CONTENT.createLabel}
          </Button>
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

        <SentenceAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onLevelToggle={(level) => state.setLevelInput((prev) => (prev === level ? undefined : level))}
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
          onOpenEdit={state.handleOpenEdit}
          onDelete={state.handleDelete}
          onPlayAudio={state.handlePlayAudio}
        />
      </section>
    </>
  )
}
