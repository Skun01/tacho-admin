import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_KANJI_CONTENT } from '@/constants/adminContent'
import { useKanjiAdminDetail } from '@/hooks/useKanjiAdminDetail'
import { useKanjiAdminList } from '@/hooks/useKanjiAdminList'
import { useKanjiAdminMutations } from '@/hooks/useKanjiAdminMutations'
import { downloadBlobFile } from '@/lib/fileJson'
import { kanjiAdminService } from '@/services/kanjiAdminService'
import type {
  KanjiAdminDetail,
  KanjiAdminItem,
  KanjiLevel,
  KanjiSearchQuery,
  KanjiStatus,
  KanjiUpsertPayload,
} from '@/types/kanjiAdmin'

const PAGE_SIZE = 20

export function useAdminKanjiPageState() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<KanjiLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<KanjiStatus | undefined>(undefined)
  const [strokeCountMinInput, setStrokeCountMinInput] = useState<number | undefined>(undefined)
  const [strokeCountMaxInput, setStrokeCountMaxInput] = useState<number | undefined>(undefined)
  const [radicalInput, setRadicalInput] = useState('')
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [query, setQuery] = useState<KanjiSearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  // Form state (modal)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<KanjiAdminDetail | null>(null)

  const { data, isLoading, isFetching, isError, error } = useKanjiAdminList(query)
  const { createMutation, updateMutation, deleteMutation, getApiErrorMessage } = useKanjiAdminMutations()
  const { fetchDetail, isLoadingDetail } = useKanjiAdminDetail()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

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
      strokeCountMin: strokeCountMinInput,
      strokeCountMax: strokeCountMaxInput,
      radical: radicalInput.trim() || undefined,
      createdByMe: createdByMeInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setLevelInput(undefined)
    setStatusInput(undefined)
    setStrokeCountMinInput(undefined)
    setStrokeCountMaxInput(undefined)
    setRadicalInput('')
    setCreatedByMeInput(false)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  // --- Form modal handlers ---

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormMode('create')
  }

  const handleOpenEdit = async (item: KanjiAdminItem) => {
    setFormMode('edit')
    try {
      const detail = await fetchDetail(item.id)
      setEditingItem(detail)
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_KANJI_CONTENT.toast.crudErrorFallback))
      setFormMode(null)
    }
  }

  const handleCloseForm = () => {
    setFormMode(null)
    setEditingItem(null)
  }

  const handleSubmitForm = async (payload: KanjiUpsertPayload) => {
    try {
      if (formMode === 'create') {
        await createMutation.mutateAsync(payload)
        gooeyToast.success(ADMIN_KANJI_CONTENT.toast.createSuccess)
      } else if (formMode === 'edit' && editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload })
        gooeyToast.success(ADMIN_KANJI_CONTENT.toast.updateSuccess)
      }
      handleCloseForm()
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_KANJI_CONTENT.toast.crudErrorFallback))
    }
  }

  // --- Delete ---

  const handleDelete = async (item: KanjiAdminItem) => {
    const shouldDelete = window.confirm(ADMIN_KANJI_CONTENT.actions.confirmDelete)
    if (!shouldDelete) return

    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_KANJI_CONTENT.toast.deleteSuccess)
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_KANJI_CONTENT.toast.crudErrorFallback))
    }
  }

  // --- Import / Export ---

  const handleOpenImport = () => {
    setIsImportDialogOpen(true)
  }

  const handleCloseImport = () => {
    setIsImportDialogOpen(false)
  }

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await kanjiAdminService.getImportTemplate()
      downloadBlobFile(data, 'kanji-import-template.json')
      gooeyToast.success(ADMIN_KANJI_CONTENT.toast.downloadTemplateSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_KANJI_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleExportJson = async () => {
    try {
      const { data } = await kanjiAdminService.exportJson(query)
      downloadBlobFile(data, 'kanji-export.json')
      gooeyToast.success(ADMIN_KANJI_CONTENT.toast.exportSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_KANJI_CONTENT.toast.crudErrorFallback))
    }
  }

  return {
    isImportDialogOpen,
    keywordInput,
    levelInput,
    statusInput,
    strokeCountMinInput,
    strokeCountMaxInput,
    radicalInput,
    createdByMeInput,
    isLoading,
    isFetching,
    isDeleting: deleteMutation.isPending,
    isSubmitting,
    isLoadingDetail,
    items,
    totalItems,
    currentPage,
    totalPage,
    formMode,
    editingItem,
    setKeywordInput,
    setLevelInput,
    setStatusInput,
    setStrokeCountMinInput,
    setStrokeCountMaxInput,
    setRadicalInput,
    setCreatedByMeInput,
    handleSearch,
    handleReset,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmitForm,
    handleOpenImport,
    handleCloseImport,
    handleDownloadTemplate,
    handleExportJson,
    handleDelete,
  }
}
