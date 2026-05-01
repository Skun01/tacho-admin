import { useCallback, useMemo, useState } from 'react'
import { useJlptAiQuestionSearch } from '@/hooks/useJlptAdminQueries'
import type { AiQuestionStatus, JlptLevel, SectionType } from '@/types/jlptAdmin'

const PAGE_SIZE = 10

export function useAdminJlptAiQuestionsPageState() {
  const [levelInput, setLevelInput] = useState<JlptLevel | undefined>(undefined)
  const [sectionTypeInput, setSectionTypeInput] = useState<SectionType | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<AiQuestionStatus | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

  const params = useMemo(
    () => ({
      level: levelInput,
      sectionType: sectionTypeInput,
      status: statusInput,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    [levelInput, sectionTypeInput, statusInput, currentPage],
  )

  const searchQuery = useJlptAiQuestionSearch(params)
  const { items, meta } = searchQuery.data ?? { items: [], meta: null }
  const totalPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1
  const totalItems = meta?.total ?? 0

  const handleSearch = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setLevelInput(undefined)
    setSectionTypeInput(undefined)
    setStatusInput(undefined)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleOpenGenerate = useCallback(() => {
    setIsGenerateDialogOpen(true)
  }, [])

  const handleCloseGenerate = useCallback(() => {
    setIsGenerateDialogOpen(false)
  }, [])

  return {
    levelInput,
    setLevelInput,
    sectionTypeInput,
    setSectionTypeInput,
    statusInput,
    setStatusInput,
    currentPage,
    totalPage,
    totalItems,
    items,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    isGenerateDialogOpen,
    handleSearch,
    handleReset,
    handlePageChange,
    handleOpenGenerate,
    handleCloseGenerate,
  }
}
