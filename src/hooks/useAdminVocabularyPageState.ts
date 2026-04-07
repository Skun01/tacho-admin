import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useVocabularyAdminDetail } from '@/hooks/useVocabularyAdminDetail'
import { useVocabularyAdminList } from '@/hooks/useVocabularyAdminList'
import { useVocabularyAdminMutations } from '@/hooks/useVocabularyAdminMutations'
import type {
  VocabularyAdminDetail,
  VocabularyAdminItem,
  VocabularyLevel,
  VocabularySearchQuery,
  VocabularyStatus,
  VocabularyUpsertPayload,
} from '@/types/vocabularyAdmin'

const PAGE_SIZE = 20

export function useAdminVocabularyPageState() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<VocabularyAdminDetail | null>(null)
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<VocabularyLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<VocabularyStatus | undefined>(undefined)
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [query, setQuery] = useState<VocabularySearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  const { fetchDetail, isLoadingDetail } = useVocabularyAdminDetail()
  const { data, isLoading, isFetching, isError, error } = useVocabularyAdminList(query)
  const { createMutation, updateMutation, deleteMutation, getApiErrorMessage } = useVocabularyAdminMutations()

  useEffect(() => {
    if (!isError) return
    gooeyToast.error(getApiErrorMessage(error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [isError, error, getApiErrorMessage])

  const items = data?.data ?? []
  const meta = data?.metaData
  const totalItems = meta?.total ?? items.length
  const currentPage = meta?.page ?? query.page
  const totalPage = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1

  const handleSearch = () => {
    setQuery({
      q: keywordInput.trim() || undefined,
      level: levelInput,
      status: statusInput,
      createdByMe: createdByMeInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setCreatedByMeInput(false)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormMode('create')
  }

  const handleOpenEdit = async (item: VocabularyAdminItem) => {
    setFormMode('edit')
    setEditingItem(null)

    try {
      const detail = await fetchDetail(item.id)
      setEditingItem(detail)
    } catch (detailError) {
      gooeyToast.error(getApiErrorMessage(detailError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
      setFormMode(null)
    }
  }

  const handleCloseForm = () => {
    setFormMode(null)
    setEditingItem(null)
  }

  const handleSubmitForm = async (payload: VocabularyUpsertPayload) => {
    try {
      if (formMode === 'edit' && editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload })
        gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.updateSuccess)
      } else {
        await createMutation.mutateAsync(payload)
        gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.createSuccess)
      }

      handleCloseForm()
    } catch (submitError) {
      gooeyToast.error(getApiErrorMessage(submitError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleDelete = async (item: VocabularyAdminItem) => {
    const shouldDelete = window.confirm(ADMIN_VOCABULARY_CONTENT.actions.confirmDelete)
    if (!shouldDelete) return

    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.deleteSuccess)
      if (editingItem?.id === item.id) {
        handleCloseForm()
      }
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  return {
    formMode,
    editingItem,
    keywordInput,
    levelInput,
    statusInput,
    createdByMeInput,
    isLoading,
    isFetching,
    isLoadingDetail,
    isDeleting: deleteMutation.isPending,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    items,
    totalItems,
    currentPage,
    totalPage,
    setKeywordInput,
    setLevelInput,
    setStatusInput,
    setCreatedByMeInput,
    handleSearch,
    handleReset,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmitForm,
    handleDelete,
  }
}