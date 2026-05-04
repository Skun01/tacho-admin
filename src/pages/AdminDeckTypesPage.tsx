import { useEffect, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { format } from 'date-fns'
import { PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { AdminDeckConfirmDialog } from '@/components/deck/AdminDeckConfirmDialog'
import { AdminDeckTypeFormDialog } from '@/components/deck/AdminDeckTypeFormDialog'
import { Button } from '@/components/ui/button'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Input } from '@/components/ui/input'
import { AdminTableSection } from '@/components/shared/AdminTableSection'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { useDeckTypeAdminList } from '@/hooks/useDeckTypeAdminList'
import { useDeckTypeAdminMutations } from '@/hooks/useDeckTypeAdminMutations'
import type { AdminDeckTypeResponse } from '@/types/deckAdmin'

const PAGE_SIZE = 20

export function AdminDeckTypesPage() {
  const [keywordInput, setKeywordInput] = useState('')
  const [query, setQuery] = useState({ page: 1, pageSize: PAGE_SIZE, q: undefined as string | undefined })
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<AdminDeckTypeResponse | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminDeckTypeResponse | null>(null)

  const listQuery = useDeckTypeAdminList(query)
  const { createMutation, updateMutation, deleteMutation, getApiErrorMessage } = useDeckTypeAdminMutations()

  useEffect(() => {
    if (!listQuery.isError) return
    gooeyToast.error(getApiErrorMessage(listQuery.error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [getApiErrorMessage, listQuery.error, listQuery.isError])

  const items = listQuery.data?.items ?? []
  const meta = listQuery.data?.meta
  const currentPage = meta?.page ?? query.page
  const totalPage = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1

  function handleSearch() {
    setQuery({
      q: keywordInput.trim() || undefined,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  async function handleSubmit(values: { name: string }) {
    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync({ name: values.name.trim() })
        gooeyToast.success(ADMIN_DECK_CONTENT.deckTypePage.toast.createSuccess)
      } else if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          payload: { name: values.name.trim() },
        })
        gooeyToast.success(ADMIN_DECK_CONTENT.deckTypePage.toast.updateSuccess)
      }

      setDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.deckTypePage.toast.crudErrorFallback))
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.deckTypePage.toast.deleteSuccess)
      setDeleteTarget(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.deckTypePage.toast.crudErrorFallback))
    }
  }

  return (
    <>
      <Helmet>
        <title>{ADMIN_DECK_CONTENT.deckTypePage.pageTitle} | Tacho Admin</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{ADMIN_DECK_CONTENT.deckTypePage.heading}</h1>
            <p className="text-sm text-muted-foreground">{ADMIN_DECK_CONTENT.deckTypePage.description}</p>
          </div>

          <Button
            type="button"
            onClick={() => {
              setDialogMode('create')
              setEditingItem(null)
              setDialogOpen(true)
            }}
          >
            <PlusIcon size={16} />
            {ADMIN_DECK_CONTENT.deckTypePage.createLabel}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleSearch()
              }
            }}
            placeholder={ADMIN_DECK_CONTENT.deckTypePage.searchPlaceholder}
            className="max-w-md"
          />
          <Button type="button" onClick={handleSearch}>
            {ADMIN_DECK_CONTENT.searchLabel}
          </Button>
        </div>

        <AdminTableSection
          title={ADMIN_DECK_CONTENT.deckTypePage.tableTitle}
          isLoading={listQuery.isLoading}
          isFetching={listQuery.isFetching}
          hasItems={items.length > 0}
          currentPage={currentPage}
          totalPage={totalPage}
          previousPageLabel="Trang trước"
          nextPageLabel="Trang sau"
          emptyTitle={ADMIN_DECK_CONTENT.deckTypePage.emptyTitle}
          emptyDescription={ADMIN_DECK_CONTENT.deckTypePage.emptyDescription}
          emptyActionLabel={ADMIN_DECK_CONTENT.deckTypePage.emptyActionLabel}
          onEmptyAction={() => {
            setDialogMode('create')
            setEditingItem(null)
            setDialogOpen(true)
          }}
          onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{ADMIN_DECK_CONTENT.deckTypePage.columns.name}</TableHead>
                <TableHead>{ADMIN_DECK_CONTENT.deckTypePage.columns.createdAt}</TableHead>
                <TableHead>{ADMIN_DECK_CONTENT.deckTypePage.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setDialogMode('edit')
                          setEditingItem(item)
                          setDialogOpen(true)
                        }}
                      >
                        <PencilSimpleIcon size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <TrashIcon size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableSection>
      </section>

      <AdminDeckTypeFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialName={editingItem?.name ?? ''}
        isPending={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />

      <AdminDeckConfirmDialog
        open={Boolean(deleteTarget)}
        title={ADMIN_DECK_CONTENT.deckTypePage.confirmDeleteTitle}
        description={ADMIN_DECK_CONTENT.deckTypePage.confirmDeleteDescription}
        confirmLabel={ADMIN_DECK_CONTENT.deckTypePage.confirmDeleteAction}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}
