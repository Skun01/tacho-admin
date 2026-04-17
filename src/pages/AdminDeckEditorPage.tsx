import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { format } from 'date-fns'
import { ArrowLeftIcon, PlusIcon } from '@phosphor-icons/react'
import { useNavigate, useParams } from 'react-router'
import { AdminDeckAddCardDialog } from '@/components/deck/AdminDeckAddCardDialog'
import { AdminDeckConfirmDialog } from '@/components/deck/AdminDeckConfirmDialog'
import { AdminDeckFolderForm } from '@/components/deck/AdminDeckFolderForm'
import { AdminDeckFolderSection } from '@/components/deck/AdminDeckFolderSection'
import { AdminDeckForm } from '@/components/deck/AdminDeckForm'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { useDeckAdminDetail } from '@/hooks/useDeckAdminDetail'
import { useDeckAdminMutations } from '@/hooks/useDeckAdminMutations'
import { useDeckTypeAdminList } from '@/hooks/useDeckTypeAdminList'
import type { AdminDeckFormValues } from '@/lib/validations/deckAdmin'
import { resourceService } from '@/services/resourceService'
import type {
  DeckFolderResponse,
  ReorderFolderCardsPayload,
  ReorderFoldersPayload,
} from '@/types/deckAdmin'

function buildFolderOrderPayload(
  folders: DeckFolderResponse[],
  targetFolderId: string,
  direction: 'up' | 'down',
): ReorderFoldersPayload | null {
  const sorted = [...folders].sort((left, right) => left.position - right.position)
  const currentIndex = sorted.findIndex((item) => item.id === targetFolderId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
    return null
  }

  const next = [...sorted]
  const [moved] = next.splice(currentIndex, 1)
  next.splice(targetIndex, 0, moved)

  return {
    items: next.map((folder, index) => ({
      folderId: folder.id,
      position: (index + 1) * 1000,
    })),
  }
}

function buildCardOrderPayload(
  folder: DeckFolderResponse,
  cardId: string,
  direction: 'up' | 'down',
): ReorderFolderCardsPayload | null {
  const sorted = [...folder.cards].sort((left, right) => left.position - right.position)
  const currentIndex = sorted.findIndex((item) => item.cardId === cardId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
    return null
  }

  const next = [...sorted]
  const [moved] = next.splice(currentIndex, 1)
  next.splice(targetIndex, 0, moved)

  return {
    items: next.map((item, index) => ({
      cardId: item.cardId,
      position: (index + 1) * 1000,
    })),
  }
}

export function AdminDeckEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isCreateMode = !id
  const deckId = id ?? ''

  const deckDetailQuery = useDeckAdminDetail(deckId, !isCreateMode)
  const deckTypeQuery = useDeckTypeAdminList({ page: 1, pageSize: 100 })
  const {
    createMutation,
    updateMutation,
    deleteMutation,
    publishMutation,
    archiveMutation,
    unpublishMutation,
    createFolderMutation,
    reorderFoldersMutation,
    updateFolderMutation,
    deleteFolderMutation,
    addCardMutation,
    removeCardMutation,
    reorderCardsMutation,
    getApiErrorMessage,
  } = useDeckAdminMutations()

  const [searchCardsQuery, setSearchCardsQuery] = useState('')
  const [editingFolder, setEditingFolder] = useState<DeckFolderResponse | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [addCardFolder, setAddCardFolder] = useState<DeckFolderResponse | null>(null)
  const [deleteDeckConfirmOpen, setDeleteDeckConfirmOpen] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<DeckFolderResponse | null>(null)

  const deck = deckDetailQuery.data
  const sortedFolders = useMemo(
    () => deck?.folders.slice().sort((left, right) => left.position - right.position) ?? [],
    [deck],
  )
  const allCardIds = useMemo(
    () => sortedFolders.flatMap((folder) => folder.cards.map((item) => item.cardId)),
    [sortedFolders],
  )

  const pageTitle = isCreateMode
    ? ADMIN_DECK_CONTENT.editor.createPageTitle
    : `${deck?.title ?? ADMIN_DECK_CONTENT.editor.editPageTitle} | Tacho Admin`

  const editorDescription = isCreateMode
    ? ADMIN_DECK_CONTENT.editor.createDescription
    : deck?.description || ADMIN_DECK_CONTENT.editor.editDescription

  async function uploadCoverIfNeeded(file?: File | null) {
    if (!file) return deck?.coverImageUrl ?? null
    const { data } = await resourceService.uploadImage(file)
    return data.data.fileUrl
  }

  async function handleSubmitDeckForm(values: AdminDeckFormValues) {
    try {
      const coverImageUrl = await uploadCoverIfNeeded(values.coverImageFile)

      if (isCreateMode) {
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
        navigate(`/admin/decks/${created.id}/edit`, { replace: true })
        return
      }

      await updateMutation.mutateAsync({
        deckId,
        payload: {
          title: values.title.trim(),
          description: values.description?.trim() || '',
          coverImageUrl,
          visibility: values.visibility,
          status: values.status,
          isOfficial: values.isOfficial,
          typeId: values.typeId || null,
        },
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.updateSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleDeleteDeck() {
    if (!deck) return
    try {
      await deleteMutation.mutateAsync(deck.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.deleteSuccess)
      navigate('/admin/decks', { replace: true })
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleStatusAction(action: 'publish' | 'unpublish' | 'archive') {
    if (!deck) return
    try {
      if (action === 'publish') {
        await publishMutation.mutateAsync(deck.id)
        gooeyToast.success(ADMIN_DECK_CONTENT.toast.publishSuccess)
        return
      }
      if (action === 'unpublish') {
        await unpublishMutation.mutateAsync(deck.id)
        gooeyToast.success(ADMIN_DECK_CONTENT.toast.unpublishSuccess)
        return
      }
      await archiveMutation.mutateAsync(deck.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.archiveSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleSubmitFolderForm(values: { title: string; description?: string }) {
    if (!deck) return
    try {
      if (editingFolder) {
        await updateFolderMutation.mutateAsync({
          deckId: deck.id,
          folderId: editingFolder.id,
          payload: {
            title: values.title.trim(),
            description: values.description?.trim() || '',
          },
        })
        gooeyToast.success(ADMIN_DECK_CONTENT.toast.updateFolderSuccess)
      } else {
        await createFolderMutation.mutateAsync({
          deckId: deck.id,
          payload: {
            title: values.title.trim(),
            description: values.description?.trim() || '',
            position: (sortedFolders.length + 1) * 1000,
          },
        })
        gooeyToast.success(ADMIN_DECK_CONTENT.toast.createFolderSuccess)
      }

      setFolderDialogOpen(false)
      setEditingFolder(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleDeleteFolder() {
    if (!deck || !deleteFolderTarget) return
    try {
      await deleteFolderMutation.mutateAsync({
        deckId: deck.id,
        folderId: deleteFolderTarget.id,
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.deleteFolderSuccess)
      setDeleteFolderTarget(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleMoveFolder(folder: DeckFolderResponse, direction: 'up' | 'down') {
    if (!deck) return
    const payload = buildFolderOrderPayload(sortedFolders, folder.id, direction)
    if (!payload) return

    try {
      await reorderFoldersMutation.mutateAsync({ deckId: deck.id, payload })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.reorderSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
      await deckDetailQuery.refetch()
    }
  }

  async function handleMoveCard(folder: DeckFolderResponse, cardId: string, direction: 'up' | 'down') {
    if (!deck) return
    const payload = buildCardOrderPayload(folder, cardId, direction)
    if (!payload) return

    try {
      await reorderCardsMutation.mutateAsync({
        deckId: deck.id,
        folderId: folder.id,
        payload,
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.reorderSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
      await deckDetailQuery.refetch()
    }
  }

  async function handleAddCard(cardId: string) {
    if (!deck || !addCardFolder) return
    try {
      await addCardMutation.mutateAsync({
        deckId: deck.id,
        folderId: addCardFolder.id,
        payload: {
          cardId,
          position: (addCardFolder.cards.length + 1) * 1000,
        },
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.addCardSuccess)
      setAddCardFolder(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleRemoveCard(folder: DeckFolderResponse, cardId: string) {
    if (!deck) return
    try {
      await removeCardMutation.mutateAsync({
        deckId: deck.id,
        folderId: folder.id,
        cardId,
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.removeCardSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  if (!isCreateMode && deckDetailQuery.isError) {
    return (
      <section className="space-y-4">
        <Button type="button" variant="ghost" onClick={() => navigate('/admin/decks')}>
          <ArrowLeftIcon size={16} />
          {ADMIN_DECK_CONTENT.editor.backToListLabel}
        </Button>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {ADMIN_DECK_CONTENT.editor.detailNotFoundLabel}
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4">
          <Button type="button" variant="ghost" className="w-fit" onClick={() => navigate('/admin/decks')}>
            <ArrowLeftIcon size={16} />
            {ADMIN_DECK_CONTENT.editor.backToListLabel}
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">
              {isCreateMode ? ADMIN_DECK_CONTENT.editor.createPageTitle : ADMIN_DECK_CONTENT.editor.editPageTitle}
            </h1>
            <p className="text-sm text-muted-foreground">{editorDescription}</p>
          </div>
        </div>

        <AdminDeckForm
          title={isCreateMode ? ADMIN_DECK_CONTENT.editor.metadataTitleCreate : ADMIN_DECK_CONTENT.editor.metadataTitleEdit}
          submitLabel={isCreateMode ? ADMIN_DECK_CONTENT.editor.saveCreateLabel : ADMIN_DECK_CONTENT.editor.saveUpdateLabel}
          deckTypes={deckTypeQuery.data?.items ?? []}
          initialValues={deck}
          isPending={createMutation.isPending || updateMutation.isPending}
          onCancel={() => navigate('/admin/decks')}
          onSubmit={handleSubmitDeckForm}
        />

        {!isCreateMode && deck && (
          <>
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{ADMIN_DECK_CONTENT.editor.foldersTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.editor.foldersDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deck.status === 'Draft' && (
                    <Button type="button" variant="outline" onClick={() => handleStatusAction('publish')}>
                      {ADMIN_DECK_CONTENT.statusActions.publish}
                    </Button>
                  )}
                  {deck.status === 'Published' && (
                    <Button type="button" variant="outline" onClick={() => handleStatusAction('unpublish')}>
                      {ADMIN_DECK_CONTENT.statusActions.unpublish}
                    </Button>
                  )}
                  {deck.status !== 'Archived' && (
                    <Button type="button" variant="outline" onClick={() => handleStatusAction('archive')}>
                      {ADMIN_DECK_CONTENT.statusActions.archive}
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingFolder(null)
                      setFolderDialogOpen(true)
                    }}
                  >
                    <PlusIcon size={16} />
                    {ADMIN_DECK_CONTENT.editor.addFolderLabel}
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => setDeleteDeckConfirmOpen(true)}>
                    {ADMIN_DECK_CONTENT.actions.delete}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{ADMIN_DECK_CONTENT.editor.creatorLabel}</p>
                    <p className="font-medium">{deck.createdBy.username}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{ADMIN_DECK_CONTENT.editor.cardsLabel}</p>
                    <p className="font-medium">{deck.cardsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{ADMIN_DECK_CONTENT.editor.foldersLabel}</p>
                    <p className="font-medium">{deck.foldersCount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{ADMIN_DECK_CONTENT.editor.updatedAtLabel}</p>
                    <p className="font-medium">{format(new Date(deck.updatedAt ?? deck.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                </div>

                <Input
                  value={searchCardsQuery}
                  onChange={(event) => setSearchCardsQuery(event.target.value)}
                  placeholder={ADMIN_DECK_CONTENT.editor.searchCardsPlaceholder}
                />

                {sortedFolders.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    {ADMIN_DECK_CONTENT.editor.emptyFoldersLabel}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedFolders.map((folder) => (
                      <AdminDeckFolderSection
                        key={folder.id}
                        folder={folder}
                        searchQuery={searchCardsQuery}
                        isPending={
                          createFolderMutation.isPending ||
                          updateFolderMutation.isPending ||
                          deleteFolderMutation.isPending ||
                          addCardMutation.isPending ||
                          removeCardMutation.isPending ||
                          reorderFoldersMutation.isPending ||
                          reorderCardsMutation.isPending
                        }
                        onEdit={(target) => {
                          setEditingFolder(target)
                          setFolderDialogOpen(true)
                        }}
                        onDelete={setDeleteFolderTarget}
                        onAddCard={setAddCardFolder}
                        onRemoveCard={handleRemoveCard}
                        onMoveFolder={handleMoveFolder}
                        onMoveCard={handleMoveCard}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
              <DialogContent>
                <AdminDeckFolderForm
                  title={editingFolder ? ADMIN_DECK_CONTENT.folderForm.editTitle : ADMIN_DECK_CONTENT.folderForm.createTitle}
                  initialValues={editingFolder ?? undefined}
                  isPending={createFolderMutation.isPending || updateFolderMutation.isPending}
                  onCancel={() => {
                    setFolderDialogOpen(false)
                    setEditingFolder(null)
                  }}
                  onSubmit={handleSubmitFolderForm}
                />
              </DialogContent>
            </Dialog>

            <AdminDeckAddCardDialog
              open={Boolean(addCardFolder)}
              existingCardIds={allCardIds}
              isPending={addCardMutation.isPending}
              onOpenChange={(open) => {
                if (!open) setAddCardFolder(null)
              }}
              onAddCard={handleAddCard}
            />

            <AdminDeckConfirmDialog
              open={deleteDeckConfirmOpen}
              title={ADMIN_DECK_CONTENT.confirmDeleteTitle}
              description={ADMIN_DECK_CONTENT.confirmDeleteDescription}
              confirmLabel={ADMIN_DECK_CONTENT.confirmDeleteAction}
              isPending={deleteMutation.isPending}
              onOpenChange={setDeleteDeckConfirmOpen}
              onConfirm={handleDeleteDeck}
            />

            <AdminDeckConfirmDialog
              open={Boolean(deleteFolderTarget)}
              title={ADMIN_DECK_CONTENT.folder.deleteLabel}
              description={ADMIN_DECK_CONTENT.confirmDeleteDescription}
              confirmLabel={ADMIN_DECK_CONTENT.folder.deleteLabel}
              isPending={deleteFolderMutation.isPending}
              onOpenChange={(open) => {
                if (!open) setDeleteFolderTarget(null)
              }}
              onConfirm={handleDeleteFolder}
            />
          </>
        )}
      </section>
    </>
  )
}
