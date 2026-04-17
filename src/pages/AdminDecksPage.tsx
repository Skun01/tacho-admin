import { Helmet } from 'react-helmet-async'
import { PlusIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { AdminDeckConfirmDialog } from '@/components/deck/AdminDeckConfirmDialog'
import { AdminDeckFilters } from '@/components/deck/AdminDeckFilters'
import { AdminDeckForm } from '@/components/deck/AdminDeckForm'
import { AdminDeckTable } from '@/components/deck/AdminDeckTable'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { useAdminDecksPageState } from '@/hooks/useAdminDecksPageState'
import { useDeckAdminMutations } from '@/hooks/useDeckAdminMutations'
import { useDeckTypeAdminList } from '@/hooks/useDeckTypeAdminList'
import type { AdminDeckFormValues } from '@/lib/validations/deckAdmin'
import { resourceService } from '@/services/resourceService'
import { useState } from 'react'

export function AdminDecksPage() {
  const navigate = useNavigate()
  const state = useAdminDecksPageState()
  const deckTypeQuery = useDeckTypeAdminList({ page: 1, pageSize: 100 })
  const { createMutation, getApiErrorMessage } = useDeckAdminMutations()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  async function handleCreateDeck(values: AdminDeckFormValues) {
    try {
      const coverImageUrl = values.coverImageFile
        ? (await resourceService.uploadImage(values.coverImageFile)).data.data.fileUrl
        : null
      const created = await createMutation.mutateAsync({
        title: values.title.trim(),
        description: values.description?.trim() || '',
        coverImageUrl,
        visibility: values.visibility,
        status: values.status,
        isOfficial: values.isOfficial,
        typeId: values.typeId || null,
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.createSuccess)
      setCreateDialogOpen(false)
      navigate(`/admin/decks/${created.id}/edit`)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  return (
    <>
      <Helmet>
        <title>{ADMIN_DECK_CONTENT.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{ADMIN_DECK_CONTENT.heading}</h1>
            <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/deck-types')}>
              <SquaresFourIcon size={16} />
              {ADMIN_DECK_CONTENT.manageTypesLabel}
            </Button>
            <Button type="button" onClick={() => setCreateDialogOpen(true)}>
              <PlusIcon size={16} />
              {ADMIN_DECK_CONTENT.createLabel}
            </Button>
          </div>
        </div>

        <AdminDeckFilters
          keywordInput={state.keywordInput}
          statusInput={state.statusInput}
          visibilityInput={state.visibilityInput}
          typeIdInput={state.typeIdInput}
          isOfficialInput={state.isOfficialInput}
          deckTypes={deckTypeQuery.data?.items ?? []}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onStatusChange={state.setStatusInput}
          onVisibilityChange={state.setVisibilityInput}
          onTypeIdChange={state.setTypeIdInput}
          onIsOfficialChange={state.setIsOfficialInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <AdminDeckTable
          items={state.items}
          isLoading={state.isLoading || deckTypeQuery.isLoading}
          isFetching={state.isFetching || deckTypeQuery.isFetching}
          currentPage={state.currentPage}
          totalPage={state.totalPage}
          onPageChange={state.handlePageChange}
          onCreate={() => setCreateDialogOpen(true)}
          onOpenEdit={(item) => navigate(`/admin/decks/${item.id}/edit`)}
          onDelete={state.setPendingDeleteItem}
          onPublish={state.handlePublish}
          onUnpublish={state.handleUnpublish}
          onArchive={state.handleArchive}
        />
      </section>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl p-0">
          <AdminDeckForm
            title={ADMIN_DECK_CONTENT.editor.metadataTitleCreate}
            submitLabel={ADMIN_DECK_CONTENT.editor.saveCreateLabel}
            deckTypes={deckTypeQuery.data?.items ?? []}
            isPending={createMutation.isPending}
            variant="modal"
            onCancel={() => setCreateDialogOpen(false)}
            onSubmit={handleCreateDeck}
          />
        </DialogContent>
      </Dialog>

      <AdminDeckConfirmDialog
        open={Boolean(state.pendingDeleteItem)}
        title={ADMIN_DECK_CONTENT.confirmDeleteTitle}
        description={ADMIN_DECK_CONTENT.confirmDeleteDescription}
        confirmLabel={ADMIN_DECK_CONTENT.confirmDeleteAction}
        cancelLabel={ADMIN_DECK_CONTENT.confirmCancelLabel}
        isPending={state.isDeleting}
        onOpenChange={(open) => {
          if (!open) state.setPendingDeleteItem(null)
        }}
        onConfirm={state.handleDelete}
      />
    </>
  )
}
