import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import { ADMIN_DECK_CONTENT } from '@/constants/adminDeck'
import { useDeckAdminList } from '@/hooks/useDeckAdminList'
import { useDeckAdminMutations } from '@/hooks/useDeckAdminMutations'
import type {
  AdminDeckListItemResponse,
  AdminDeckSearchQuery,
  DeckStatus,
  DeckVisibility,
} from '@/types/deckAdmin'

const PAGE_SIZE = 20

export function useAdminDecksPageState() {
  const [keywordInput, setKeywordInput] = useState('')
  const [statusInput, setStatusInput] = useState<DeckStatus | undefined>(undefined)
  const [visibilityInput, setVisibilityInput] = useState<DeckVisibility | undefined>(undefined)
  const [typeIdInput, setTypeIdInput] = useState<string | undefined>(undefined)
  const [isOfficialInput, setIsOfficialInput] = useState(false)
  const [query, setQuery] = useState<AdminDeckSearchQuery>({ page: 1, pageSize: PAGE_SIZE })
  const [pendingDeleteItem, setPendingDeleteItem] = useState<AdminDeckListItemResponse | null>(null)

  const listQuery = useDeckAdminList(query)
  const {
    deleteMutation,
    publishMutation,
    archiveMutation,
    unpublishMutation,
    getApiErrorMessage,
  } = useDeckAdminMutations()

  useEffect(() => {
    if (!listQuery.isError) return
    gooeyToast.error(getApiErrorMessage(listQuery.error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [getApiErrorMessage, listQuery.error, listQuery.isError])

  const items = listQuery.data?.items ?? []
  const meta = listQuery.data?.meta
  const totalItems = meta?.total ?? items.length
  const currentPage = meta?.page ?? query.page ?? 1
  const totalPage = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1

  const handleSearch = () => {
    setQuery({
      q: keywordInput.trim() || undefined,
      status: statusInput,
      visibility: visibilityInput,
      typeId: typeIdInput,
      isOfficial: isOfficialInput || undefined,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setStatusInput(undefined)
    setVisibilityInput(undefined)
    setTypeIdInput(undefined)
    setIsOfficialInput(false)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }))
  }

  const handleDelete = async () => {
    if (!pendingDeleteItem) return

    try {
      await deleteMutation.mutateAsync(pendingDeleteItem.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.deleteSuccess)
      setPendingDeleteItem(null)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  const handlePublish = async (item: AdminDeckListItemResponse) => {
    try {
      await publishMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.publishSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleUnpublish = async (item: AdminDeckListItemResponse) => {
    try {
      await unpublishMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.unpublishSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleArchive = async (item: AdminDeckListItemResponse) => {
    try {
      await archiveMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_DECK_CONTENT.toast.archiveSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_DECK_CONTENT.toast.crudErrorFallback))
    }
  }

  return {
    keywordInput,
    statusInput,
    visibilityInput,
    typeIdInput,
    isOfficialInput,
    items,
    totalItems,
    currentPage,
    totalPage,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isDeleting: deleteMutation.isPending,
    pendingDeleteItem,
    setKeywordInput,
    setStatusInput,
    setVisibilityInput,
    setTypeIdInput,
    setIsOfficialInput,
    setPendingDeleteItem,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
    handlePublish,
    handleUnpublish,
    handleArchive,
  }
}
