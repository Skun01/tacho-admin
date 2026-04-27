import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'
import { useShadowingAdminMutations } from '@/hooks/useShadowingAdminMutations'
import { useShadowingTopicSearch } from '@/hooks/useShadowingAdminQueries'
import type { ShadowingLevel, ShadowingStatus, ShadowingVisibility } from '@/types/shadowingAdmin'

const PAGE_SIZE = 10

export function useAdminShadowingPageState() {
  const navigate = useNavigate()
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<ShadowingLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<ShadowingStatus | undefined>(undefined)
  const [visibilityInput, setVisibilityInput] = useState<ShadowingVisibility | undefined>(undefined)
  const [isOfficialInput, setIsOfficialInput] = useState<boolean | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const params = useMemo(
    () => ({
      q: keywordInput || undefined,
      level: levelInput,
      status: statusInput,
      visibility: visibilityInput,
      isOfficial: isOfficialInput,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    [keywordInput, levelInput, statusInput, visibilityInput, isOfficialInput, currentPage],
  )

  const searchQuery = useShadowingTopicSearch(params)
  const { items, meta } = searchQuery.data ?? { items: [], meta: null }
  const totalPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1
  const totalItems = meta?.total ?? 0

  const { deleteTopicMutation, getApiErrorMessage } = useShadowingAdminMutations()

  const handleSearch = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setVisibilityInput(undefined)
    setIsOfficialInput(undefined)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTopicMutation.mutateAsync(id)
        gooeyToast.success(SHADOWING_ADMIN_CONTENT.topicDeletedSuccess)
      } catch (error) {
        gooeyToast.error(getApiErrorMessage(error, SHADOWING_ADMIN_CONTENT.actions.delete))
      }
    },
    [deleteTopicMutation, getApiErrorMessage],
  )

  const handleOpenCreate = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setIsCreateDialogOpen(false)
  }, [])

  return {
    keywordInput,
    setKeywordInput,
    levelInput,
    setLevelInput,
    statusInput,
    setStatusInput,
    visibilityInput,
    setVisibilityInput,
    isOfficialInput,
    setIsOfficialInput,
    currentPage,
    totalPage,
    totalItems,
    items,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    isDeleting: deleteTopicMutation.isPending,
    isCreateDialogOpen,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
    handleOpenCreate,
    handleCloseCreate,
    navigate,
  }
}
