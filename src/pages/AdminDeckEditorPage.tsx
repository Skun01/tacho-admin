import { useMemo, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import {
  ArrowLeftIcon,
  BooksIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useNavigate, useParams } from 'react-router'
import { AdminDeckAddCardDialog } from '@/components/deck/AdminDeckAddCardDialog'
import { AdminDeckConfirmDialog } from '@/components/deck/AdminDeckConfirmDialog'
import { AdminDeckFolderForm } from '@/components/deck/AdminDeckFolderForm'
import { AdminDeckFolderSection } from '@/components/deck/AdminDeckFolderSection'
import { AdminDeckForm } from '@/components/deck/AdminDeckForm'
import { AdminDeckSuggestByTopicDialog } from '@/components/deck/AdminDeckSuggestByTopicDialog'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
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
  activeFolderId: string,
  overFolderId: string,
): ReorderFoldersPayload | null {
  const sorted = [...folders].sort((left, right) => left.position - right.position)
  const currentIndex = sorted.findIndex((item) => item.id === activeFolderId)
  const targetIndex = sorted.findIndex((item) => item.id === overFolderId)
  if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) {
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
  activeCardId: string,
  overCardId: string,
): ReorderFolderCardsPayload | null {
  const sorted = [...folder.cards].sort((left, right) => left.position - right.position)
  const currentIndex = sorted.findIndex((item) => item.cardId === activeCardId)
  const targetIndex = sorted.findIndex((item) => item.cardId === overCardId)
  if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) {
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
  const [suggestByTopicFolder, setSuggestByTopicFolder] = useState<DeckFolderResponse | null>(null)
  const [deleteDeckConfirmOpen, setDeleteDeckConfirmOpen] = useState(false)
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<DeckFolderResponse | null>(null)
  const [deckFormDialogOpen, setDeckFormDialogOpen] = useState(isCreateMode)
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null)
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)
  const [draggedCardState, setDraggedCardState] = useState<{
    folderId: string
    cardId: string
  } | null>(null)
  const [dragOverCardState, setDragOverCardState] = useState<{
    folderId: string
    cardId: string
  } | null>(null)

  const deck = deckDetailQuery.data
  const sortedFolders = useMemo(
    () => deck?.folders.slice().sort((left, right) => left.position - right.position) ?? [],
    [deck],
  )
  const totalCards = useMemo(
    () => sortedFolders.reduce((count, folder) => count + folder.cards.length, 0),
    [sortedFolders],
  )
  const existingCardFolderMap = useMemo(
    () =>
      sortedFolders.reduce<Record<string, string>>((result, folder) => {
        folder.cards.forEach((item) => {
          result[item.cardId] = folder.id
        })
        return result
      }, {}),
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
        setDeckFormDialogOpen(false)
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
      setDeckFormDialogOpen(false)
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

  async function handleReorderFolder(activeFolderId: string, overFolderId: string) {
    if (!deck) return
    const payload = buildFolderOrderPayload(sortedFolders, activeFolderId, overFolderId)
    if (!payload) return

    try {
      await reorderFoldersMutation.mutateAsync({ deckId: deck.id, payload })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.reorderSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
      await deckDetailQuery.refetch()
    }
  }

  async function handleReorderCard(folder: DeckFolderResponse, activeCardId: string, overCardId: string) {
    if (!deck) return
    const payload = buildCardOrderPayload(folder, activeCardId, overCardId)
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
      const currentFolder = sortedFolders.find((folder) => folder.id === addCardFolder.id) ?? addCardFolder
      await addCardMutation.mutateAsync({
        deckId: deck.id,
        folderId: currentFolder.id,
        payload: {
          cardId,
          position: (currentFolder.cards.length + 1) * 1000,
        },
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.addCardSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  async function handleSuggestAddCard(cardId: string) {
    if (!deck || !suggestByTopicFolder) return
    try {
      const currentFolder = sortedFolders.find((folder) => folder.id === suggestByTopicFolder.id) ?? suggestByTopicFolder
      await addCardMutation.mutateAsync({
        deckId: deck.id,
        folderId: currentFolder.id,
        payload: {
          cardId,
          position: (currentFolder.cards.length + 1) * 1000,
        },
      })
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.addCardSuccess)
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
        <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/80 px-6 py-12 text-center shadow-[0_2px_12px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_10px_24px_0_rgba(0,0,0,0.24)]">
          <div className="mb-4 rounded-full border border-border/60 bg-surface-container-high p-4 text-primary dark:bg-surface-container-highest">
            <BooksIcon size={28} />
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            {ADMIN_DECK_CONTENT.editor.detailNotFoundLabel}
          </p>
          <Button type="button" size="sm" className="mt-4" onClick={() => navigate('/admin/decks')}>
            {ADMIN_DECK_CONTENT.editor.backToListLabel}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        {isCreateMode ? (
          <div className="flex flex-col gap-4">
            <Button type="button" variant="ghost" className="w-fit rounded-full" onClick={() => navigate('/admin/decks')}>
              <ArrowLeftIcon size={16} />
              {ADMIN_DECK_CONTENT.editor.backToListLabel}
            </Button>

            <div>
              <h1 className="text-2xl font-semibold">{ADMIN_DECK_CONTENT.editor.createPageTitle}</h1>
              <p className="text-sm text-muted-foreground">{editorDescription}</p>
            </div>
          </div>
        ) : (
          deck && (
            <>
              <Button type="button" variant="ghost" className="w-fit rounded-full" onClick={() => navigate('/admin/decks')}>
                <ArrowLeftIcon size={16} />
                {ADMIN_DECK_CONTENT.editor.backToListLabel}
              </Button>

              <section className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="truncate text-xl font-bold text-foreground">{deck.title}</h1>
                      <button
                        type="button"
                        onClick={() => setDeckFormDialogOpen(true)}
                        aria-label={ADMIN_DECK_CONTENT.editor.openEditModalLabel}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
                      >
                        <PencilSimpleIcon size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                    {deck.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{deck.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-semibold text-foreground">{ADMIN_DECK_CONTENT.editor.typeLabel}: </span>
                    {deck.type.name ?? ADMIN_DECK_CONTENT.editor.typeEmptyLabel}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{ADMIN_DECK_CONTENT.editor.creatorLabel}: </span>
                    {deck.createdBy.username}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{ADMIN_DECK_CONTENT.editor.cardsLabel}: </span>
                    {deck.cardsCount}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{ADMIN_DECK_CONTENT.editor.foldersLabel}: </span>
                    {deck.foldersCount}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{ADMIN_DECK_CONTENT.editor.bookmarksLabel}: </span>
                    {deck.bookmarkCount}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {deck.status === 'Draft' && (
                    <Button type="button" variant="outline" className="rounded-xl px-4 py-2 text-sm font-semibold" onClick={() => handleStatusAction('publish')}>
                      {ADMIN_DECK_CONTENT.statusActions.publish}
                    </Button>
                  )}
                  {deck.status === 'Published' && (
                    <Button type="button" variant="outline" className="rounded-xl px-4 py-2 text-sm font-semibold" onClick={() => handleStatusAction('unpublish')}>
                      {ADMIN_DECK_CONTENT.statusActions.unpublish}
                    </Button>
                  )}
                  {deck.status !== 'Archived' && (
                    <Button type="button" variant="outline" className="rounded-xl px-4 py-2 text-sm font-semibold" onClick={() => handleStatusAction('archive')}>
                      {ADMIN_DECK_CONTENT.statusActions.archive}
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="rounded-xl px-4 py-2 text-sm font-semibold"
                    onClick={() => {
                      setEditingFolder(null)
                      setFolderDialogOpen(true)
                    }}
                  >
                    <PlusIcon size={14} />
                    {ADMIN_DECK_CONTENT.editor.addFolderLabel}
                  </Button>
                  <Button type="button" variant="outline" className="ml-auto rounded-xl border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700" onClick={() => setDeleteDeckConfirmOpen(true)}>
                    {ADMIN_DECK_CONTENT.actions.delete}
                  </Button>
                </div>
              </section>

              {totalCards > 0 && (
                <div className="flex min-h-11 items-center gap-2 rounded-full border border-border/60 bg-background px-4 shadow-[0_1px_3px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_1px_6px_0_rgba(0,0,0,0.18)]">
                  <MagnifyingGlassIcon size={14} className="shrink-0 text-muted-foreground" />
                  <Input
                    value={searchCardsQuery}
                    onChange={(event) => setSearchCardsQuery(event.target.value)}
                    placeholder={ADMIN_DECK_CONTENT.editor.searchCardsPlaceholder}
                    className="h-11 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
                  />
                  {searchCardsQuery.trim() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setSearchCardsQuery('')}
                      aria-label={ADMIN_DECK_CONTENT.resetFiltersLabel}
                      title={ADMIN_DECK_CONTENT.resetFiltersLabel}
                    >
                      <XIcon size={12} />
                    </Button>
                  )}
                </div>
              )}

              <section className="space-y-4">
                {sortedFolders.length === 0 ? (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/80 px-6 py-12 text-center shadow-[0_2px_12px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_10px_24px_0_rgba(0,0,0,0.24)]">
                    <div className="mb-4 rounded-full border border-border/60 bg-surface-container-high p-4 text-primary dark:bg-surface-container-highest">
                      <BooksIcon size={28} />
                    </div>
                    <p className="max-w-md text-sm text-muted-foreground">
                      {ADMIN_DECK_CONTENT.editor.emptyFoldersLabel}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setEditingFolder(null)
                        setFolderDialogOpen(true)
                      }}
                    >
                      {ADMIN_DECK_CONTENT.editor.addFolderLabel}
                    </Button>
                  </div>
                ) : (
                  sortedFolders.map((folder) => (
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
                      draggable={!searchCardsQuery.trim()}
                      isDragOver={dragOverFolderId === folder.id && draggedFolderId !== folder.id}
                      onDragStart={() => {
                        if (searchCardsQuery.trim()) return
                        setDraggedFolderId(folder.id)
                      }}
                      onDragOver={(event) => {
                        if (searchCardsQuery.trim()) return
                        event.preventDefault()
                        setDragOverFolderId(folder.id)
                      }}
                      onDrop={() => {
                        if (!draggedFolderId || draggedFolderId === folder.id) {
                          setDragOverFolderId(null)
                          return
                        }

                        void handleReorderFolder(draggedFolderId, folder.id)
                        setDraggedFolderId(null)
                        setDragOverFolderId(null)
                      }}
                      onDragEnd={() => {
                        setDraggedFolderId(null)
                        setDragOverFolderId(null)
                      }}
                      onEdit={(target) => {
                        setEditingFolder(target)
                        setFolderDialogOpen(true)
                      }}
                      onDelete={setDeleteFolderTarget}
                      onAddCard={setAddCardFolder}
                      onSuggestByTopic={setSuggestByTopicFolder}
                      onRemoveCard={handleRemoveCard}
                      onDragCardStart={(cardId) => {
                        if (searchCardsQuery.trim()) return
                        setDraggedCardState({ folderId: folder.id, cardId })
                      }}
                      onDragCardOver={(cardId) => {
                        if (searchCardsQuery.trim()) return
                        setDragOverCardState({ folderId: folder.id, cardId })
                      }}
                      onDropCard={(cardId) => {
                        if (
                          !draggedCardState ||
                          draggedCardState.folderId !== folder.id ||
                          draggedCardState.cardId === cardId
                        ) {
                          setDragOverCardState(null)
                          return
                        }

                        void handleReorderCard(folder, draggedCardState.cardId, cardId)
                        setDraggedCardState(null)
                        setDragOverCardState(null)
                      }}
                      onDragCardEnd={() => {
                        setDraggedCardState(null)
                        setDragOverCardState(null)
                      }}
                      draggedCardId={
                        draggedCardState?.folderId === folder.id ? draggedCardState.cardId : null
                      }
                      dragOverCardId={
                        dragOverCardState?.folderId === folder.id ? dragOverCardState.cardId : null
                      }
                    />
                  ))
                )}
              </section>

              <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                <DialogContent className="max-w-md overflow-hidden p-0">
                  <AdminDeckFolderForm
                    title={editingFolder ? ADMIN_DECK_CONTENT.folderForm.editTitle : ADMIN_DECK_CONTENT.folderForm.createTitle}
                    initialValues={editingFolder ?? undefined}
                    isPending={createFolderMutation.isPending || updateFolderMutation.isPending}
                    variant="modal"
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
                existingCardFolderMap={existingCardFolderMap}
                isPending={addCardMutation.isPending}
                onOpenChange={(open) => {
                  if (!open) setAddCardFolder(null)
                }}
                onAddCard={handleAddCard}
                onRemoveCard={(cardId, folderId) => {
                  const folder = sortedFolders.find((item) => item.id === folderId)
                  if (!folder) return
                  void handleRemoveCard(folder, cardId)
                }}
              />

              <AdminDeckSuggestByTopicDialog
                open={Boolean(suggestByTopicFolder)}
                existingCardFolderMap={existingCardFolderMap}
                isPending={addCardMutation.isPending}
                onOpenChange={(open) => {
                  if (!open) setSuggestByTopicFolder(null)
                }}
                onAddCard={handleSuggestAddCard}
                onRemoveCard={(cardId, folderId) => {
                  const folder = sortedFolders.find((item) => item.id === folderId)
                  if (!folder) return
                  void handleRemoveCard(folder, cardId)
                }}
              />

              <AdminDeckConfirmDialog
                open={deleteDeckConfirmOpen}
                title={ADMIN_DECK_CONTENT.confirmDeleteTitle}
                description={ADMIN_DECK_CONTENT.confirmDeleteDescription}
                confirmLabel={ADMIN_DECK_CONTENT.confirmDeleteAction}
                cancelLabel={ADMIN_DECK_CONTENT.confirmCancelLabel}
                isPending={deleteMutation.isPending}
                onOpenChange={setDeleteDeckConfirmOpen}
                onConfirm={handleDeleteDeck}
              />

              <AdminDeckConfirmDialog
                open={Boolean(deleteFolderTarget)}
                title={ADMIN_DECK_CONTENT.folder.deleteLabel}
                description={ADMIN_DECK_CONTENT.confirmDeleteDescription}
                confirmLabel={ADMIN_DECK_CONTENT.folder.deleteLabel}
                cancelLabel={ADMIN_DECK_CONTENT.confirmCancelLabel}
                isPending={deleteFolderMutation.isPending}
                onOpenChange={(open) => {
                  if (!open) setDeleteFolderTarget(null)
                }}
                onConfirm={handleDeleteFolder}
              />
            </>
          )
        )}

        <Dialog
          open={deckFormDialogOpen}
          onOpenChange={(open) => {
            setDeckFormDialogOpen(open)
            if (!open && isCreateMode) {
              navigate('/admin/decks')
            }
          }}
        >
          <DialogContent className="max-w-md overflow-hidden p-0">
            <AdminDeckForm
              title={isCreateMode ? ADMIN_DECK_CONTENT.editor.metadataTitleCreate : ADMIN_DECK_CONTENT.editor.metadataTitleEdit}
              submitLabel={isCreateMode ? ADMIN_DECK_CONTENT.editor.saveCreateLabel : ADMIN_DECK_CONTENT.editor.saveUpdateLabel}
              deckTypes={deckTypeQuery.data?.items ?? []}
              initialValues={deck}
              isPending={createMutation.isPending || updateMutation.isPending}
              variant="modal"
              onCancel={() => {
                setDeckFormDialogOpen(false)
                if (isCreateMode) {
                  navigate('/admin/decks')
                }
              }}
              onSubmit={handleSubmitDeckForm}
            />
          </DialogContent>
        </Dialog>
      </section>
    </>
  )
}
