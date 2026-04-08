import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useVocabularyAdminList } from '@/hooks/useVocabularyAdminList'
import { useVocabularyAdminMutations } from '@/hooks/useVocabularyAdminMutations'
import type {
  VocabularyAdminItem,
  VocabularyLevel,
  VocabularySearchQuery,
  VocabularyStatus,
} from '@/types/vocabularyAdmin'

const PAGE_SIZE = 20

export function useAdminVocabularyPageState() {
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<VocabularyLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<VocabularyStatus | undefined>(undefined)
  const [wordTypeInput, setWordTypeInput] = useState<string | undefined>(undefined)
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [hasAudioInput, setHasAudioInput] = useState<boolean | undefined>(undefined)
  const [query, setQuery] = useState<VocabularySearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  const { data, isLoading, isFetching, isError, error } = useVocabularyAdminList(query)
  const { deleteMutation, getApiErrorMessage } = useVocabularyAdminMutations()

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
      wordType: wordTypeInput,
      createdByMe: createdByMeInput,
      hasAudio: hasAudioInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setWordTypeInput(undefined)
    setCreatedByMeInput(false)
    setHasAudioInput(undefined)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  const handleDelete = async (item: VocabularyAdminItem) => {
    const shouldDelete = window.confirm(ADMIN_VOCABULARY_CONTENT.actions.confirmDelete)
    if (!shouldDelete) return

    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.deleteSuccess)
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  return {
    keywordInput,
    levelInput,
    statusInput,
    wordTypeInput,
    createdByMeInput,
    hasAudioInput,
    isLoading,
    isFetching,
    isDeleting: deleteMutation.isPending,
    items,
    totalItems,
    currentPage,
    totalPage,
    setKeywordInput,
    setLevelInput,
    setStatusInput,
    setWordTypeInput,
    setCreatedByMeInput,
    setHasAudioInput,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
  }
}