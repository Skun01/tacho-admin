import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_GRAMMAR_CONTENT } from '@/constants/adminContent'
import { useGrammarAdminList } from '@/hooks/useGrammarAdminList'
import { useGrammarAdminMutations } from '@/hooks/useGrammarAdminMutations'
import { downloadBlobFile } from '@/lib/fileJson'
import { grammarAdminService } from '@/services/grammarAdminService'
import type {
  GrammarAdminItem,
  GrammarLevel,
  GrammarRegister,
  GrammarSearchQuery,
  GrammarStatus,
} from '@/types/grammarAdmin'

const PAGE_SIZE = 20

export function useAdminGrammarPageState() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<GrammarLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<GrammarStatus | undefined>(undefined)
  const [registerInput, setRegisterInput] = useState<GrammarRegister | undefined>(undefined)
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [query, setQuery] = useState<GrammarSearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  const { data, isLoading, isFetching, isError, error } = useGrammarAdminList(query)
  const { deleteMutation, getApiErrorMessage } = useGrammarAdminMutations()

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
      register: registerInput,
      createdByMe: createdByMeInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setRegisterInput(undefined)
    setCreatedByMeInput(false)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  const handleDelete = async (item: GrammarAdminItem) => {
    const shouldDelete = window.confirm(ADMIN_GRAMMAR_CONTENT.actions.confirmDelete)
    if (!shouldDelete) return

    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.deleteSuccess)
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_GRAMMAR_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleOpenImport = () => {
    setIsImportDialogOpen(true)
  }

  const handleCloseImport = () => {
    setIsImportDialogOpen(false)
  }

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await grammarAdminService.getImportTemplate()
      downloadBlobFile(data, 'grammar-import-template.json')
      gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.downloadTemplateSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleExportJson = async () => {
    try {
      const { data } = await grammarAdminService.exportJson(query)
      downloadBlobFile(data, 'grammar-export.json')
      gooeyToast.success(ADMIN_GRAMMAR_CONTENT.toast.exportSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_GRAMMAR_CONTENT.toast.crudErrorFallback))
    }
  }

  return {
    isImportDialogOpen,
    keywordInput,
    levelInput,
    statusInput,
    registerInput,
    createdByMeInput,
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
    setRegisterInput,
    setCreatedByMeInput,
    handleSearch,
    handleReset,
    handlePageChange,
    handleOpenImport,
    handleCloseImport,
    handleDownloadTemplate,
    handleExportJson,
    handleDelete,
  }
}
