import { Helmet } from 'react-helmet-async'
import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { VocabularyAdminFilters } from '@/components/content/admin/VocabularyAdminFilters'
import { VocabularyAdminTable } from '@/components/content/admin/VocabularyAdminTable'
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
        <header className="space-y-2">
          <h2 className="font-heading-vn text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
            {ADMIN_VOCABULARY_CONTENT.heading}
          </h2>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_VOCABULARY_CONTENT.description}
          </p>
          <Button type="button" onClick={() => navigate('/admin/vocabulary/create')} className="mt-2">
            <PlusIcon size={16} />
            {ADMIN_VOCABULARY_CONTENT.createLabel}
          </Button>
        </header>

        <VocabularyAdminFilters
          keywordInput={state.keywordInput}
          levelInput={state.levelInput}
          statusInput={state.statusInput}
          createdByMeInput={state.createdByMeInput}
          totalItems={state.totalItems}
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
          onOpenEdit={(item) => navigate(`/admin/vocabulary/${item.id}/edit`)}
          onDelete={state.handleDelete}
        />
      </section>
    </>
  )
}