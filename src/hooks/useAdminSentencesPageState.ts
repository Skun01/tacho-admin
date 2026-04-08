import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_SENTENCE_CONTENT } from '@/constants/adminContent'
import { useSentenceAdminList } from '@/hooks/useSentenceAdminList'
import { useSentenceAdminMutations } from '@/hooks/useSentenceAdminMutations'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { SentenceAdminItem, SentenceLevel, SentenceSearchQuery, SentenceUpsertPayload } from '@/types/sentenceAdmin'

const PAGE_SIZE = 20

export function useAdminSentencesPageState() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<SentenceAdminItem | null>(null)
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<SentenceLevel | undefined>(undefined)
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [hasAudioInput, setHasAudioInput] = useState<boolean | undefined>(undefined)
  const [query, setQuery] = useState<SentenceSearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  const { data, isLoading, isFetching, isError, error } = useSentenceAdminList(query)
  const { createMutation, updateMutation, deleteMutation, getApiErrorMessage } = useSentenceAdminMutations()

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
      createdByMe: createdByMeInput,
      hasAudio: hasAudioInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLevelInput(undefined)
    setCreatedByMeInput(false)
    setHasAudioInput(undefined)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormMode('create')
  }

  const handleOpenEdit = (item: SentenceAdminItem) => {
    setEditingItem(item)
    setFormMode('edit')
  }

  const handleCloseForm = () => {
    setFormMode(null)
    setEditingItem(null)
  }

  const handleSubmitForm = async (payload: SentenceUpsertPayload) => {
    try {
      if (formMode === 'edit' && editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload })
        gooeyToast.success(ADMIN_SENTENCE_CONTENT.toast.updateSuccess)
      } else {
        await createMutation.mutateAsync(payload)
        gooeyToast.success(ADMIN_SENTENCE_CONTENT.toast.createSuccess)
      }
      handleCloseForm()
    } catch (submitError) {
      gooeyToast.error(getApiErrorMessage(submitError, ADMIN_SENTENCE_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleDelete = async (item: SentenceAdminItem) => {
    const shouldDelete = window.confirm(ADMIN_SENTENCE_CONTENT.actions.confirmDelete)
    if (!shouldDelete) return

    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_SENTENCE_CONTENT.toast.deleteSuccess)
      if (editingItem?.id === item.id) {
        handleCloseForm()
      }
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_SENTENCE_CONTENT.toast.crudErrorFallback))
    }
  }

  const handlePlayAudio = async (audioUrl?: string | null) => {
    const resolvedAudioUrl = resolveApiMediaUrl(audioUrl)
    if (!resolvedAudioUrl) return

    try {
      const audio = new Audio(resolvedAudioUrl)
      await audio.play()
    } catch {
      gooeyToast.error(ADMIN_SENTENCE_CONTENT.form.playAudioFailedLabel)
    }
  }

  return {
    formMode,
    editingItem,
    keywordInput,
    levelInput,
    createdByMeInput,
    hasAudioInput,
    isLoading,
    isFetching,
    isDeleting: deleteMutation.isPending,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    items,
    totalItems,
    currentPage,
    totalPage,
    setKeywordInput,
    setLevelInput,
    setCreatedByMeInput,
    setHasAudioInput,
    handleSearch,
    handleReset,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmitForm,
    handleDelete,
    handlePlayAudio,
  }
}