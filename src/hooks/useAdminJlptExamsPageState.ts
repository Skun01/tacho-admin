import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { downloadBlobFile } from '@/lib/fileJson'
import { JLPT_EXAM_CONTENT } from '@/constants/jlptAdmin'
import { useJlptAdminMutations } from '@/hooks/useJlptAdminMutations'
import { useJlptExamSearch } from '@/hooks/useJlptAdminQueries'
import type { JlptLevel, PublishStatus } from '@/types/jlptAdmin'

const PAGE_SIZE = 10

export function useAdminJlptExamsPageState() {
  const navigate = useNavigate()
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<JlptLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<PublishStatus | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const params = useMemo(
    () => ({
      keyword: keywordInput || undefined,
      level: levelInput,
      status: statusInput,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    [keywordInput, levelInput, statusInput, currentPage],
  )

  const searchQuery = useJlptExamSearch(params)
  const { items, meta } = searchQuery.data ?? { items: [], meta: null }
  const totalPage = meta ? Math.ceil(meta.total / PAGE_SIZE) : 1
  const totalItems = meta?.total ?? 0

  const { deleteExamMutation, getApiErrorMessage } = useJlptAdminMutations()

  const handleSearch = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteExamMutation.mutateAsync(id)
        gooeyToast.success(JLPT_EXAM_CONTENT.examDeletedSuccess)
      } catch (error) {
        gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.deleteExamFailedFallback))
      }
    },
    [deleteExamMutation, getApiErrorMessage],
  )

  const handleOpenCreate = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setIsCreateDialogOpen(false)
  }, [])

  const handleOpenImport = useCallback(() => {
    setIsImportDialogOpen(true)
  }, [])

  const handleCloseImport = useCallback(() => {
    setIsImportDialogOpen(false)
  }, [])

  const handleDownloadTemplate = useCallback(async () => {
    try {
      const { examAdminService } = await import('@/services/examAdminService')
      const { data } = await examAdminService.getImportTemplate()
      downloadBlobFile(data as Blob, 'exam-import-template.json')
      gooeyToast.success(JLPT_EXAM_CONTENT.exportExam.success)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.exportExam.failedFallback))
    }
  }, [getApiErrorMessage])

  const handleDownloadImportGuide = useCallback(async () => {
    try {
      const { examAdminService } = await import('@/services/examAdminService')
      const { data } = await examAdminService.getImportGuide()
      downloadBlobFile(data as Blob, 'exam-import-guide.json')
      gooeyToast.success(JLPT_EXAM_CONTENT.exportExam.success)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.exportExam.failedFallback))
    }
  }, [getApiErrorMessage])

  const handleExportExam = useCallback(async (examId: string) => {
    try {
      const { examAdminService } = await import('@/services/examAdminService')
      const { data } = await examAdminService.exportExam(examId)
      downloadBlobFile(data as Blob, `exam-${examId}.json`)
      gooeyToast.success(JLPT_EXAM_CONTENT.exportExam.success)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_CONTENT.exportExam.failedFallback))
    }
  }, [getApiErrorMessage])

  return {
    keywordInput,
    setKeywordInput,
    levelInput,
    setLevelInput,
    statusInput,
    setStatusInput,
    currentPage,
    totalPage,
    totalItems,
    items,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    isDeleting: deleteExamMutation.isPending,
    isCreateDialogOpen,
    isImportDialogOpen,
    handleSearch,
    handleReset,
    handlePageChange,
    handleDelete,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenImport,
    handleCloseImport,
    handleDownloadTemplate,
    handleDownloadImportGuide,
    handleExportExam,
    navigate,
  }
}
