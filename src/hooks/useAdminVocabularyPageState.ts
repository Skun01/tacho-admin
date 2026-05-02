import { useEffect, useRef, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT, ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'
import { useVocabularyAdminList } from '@/hooks/useVocabularyAdminList'
import { useVocabularyAdminMutations } from '@/hooks/useVocabularyAdminMutations'
import { downloadBlobFile } from '@/lib/fileJson'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'
import type {
  VocabularyAdminItem,
  VocabularyLevel,
  VocabularySearchQuery,
  VocabularyStatus,
} from '@/types/vocabularyAdmin'

const PAGE_SIZE = 20

export function useAdminVocabularyPageState() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [levelInput, setLevelInput] = useState<VocabularyLevel | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<VocabularyStatus | undefined>(undefined)
  const [wordTypeInput, setWordTypeInput] = useState<string | undefined>(undefined)
  const [createdByMeInput, setCreatedByMeInput] = useState(false)
  const [hasAudioInput, setHasAudioInput] = useState<boolean | undefined>(undefined)
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null)
  const [pendingDeleteItem, setPendingDeleteItem] = useState<VocabularyAdminItem | null>(null)
  const [query, setQuery] = useState<VocabularySearchQuery>({ page: 1, pageSize: PAGE_SIZE })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { data, isLoading, isFetching, isError, error } = useVocabularyAdminList(query)
  const { deleteMutation, getApiErrorMessage } = useVocabularyAdminMutations()

  useEffect(() => {
    if (!isError) return
    gooeyToast.error(getApiErrorMessage(error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [isError, error, getApiErrorMessage])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

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
    try {
      await deleteMutation.mutateAsync(item.id)
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.deleteSuccess)
    } catch (deleteError) {
      gooeyToast.error(getApiErrorMessage(deleteError, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDeleteItem) return
    await handleDelete(pendingDeleteItem)
    setPendingDeleteItem(null)
  }

  const handleOpenImport = () => {
    setIsImportDialogOpen(true)
  }

  const handleCloseImport = () => {
    setIsImportDialogOpen(false)
  }

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await vocabularyAdminService.getImportTemplate()
      downloadBlobFile(data, 'vocabulary-import-template.json')
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.downloadTemplateSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleExportJson = async () => {
    try {
      const { data } = await vocabularyAdminService.exportJson(query)
      downloadBlobFile(data, 'vocabulary-export.json')
      gooeyToast.success(ADMIN_VOCABULARY_CONTENT.toast.exportSuccess)
    } catch (error) {
      gooeyToast.error(getApiErrorMessage(error, ADMIN_VOCABULARY_CONTENT.toast.crudErrorFallback))
    }
  }

  const handlePlayAudio = async (audioUrl?: string | null) => {
    const resolvedAudioUrl = resolveApiMediaUrl(audioUrl)
    if (!resolvedAudioUrl) return

    const currentAudio = audioRef.current
    const isSameAudio = playingAudioUrl === resolvedAudioUrl && currentAudio && !currentAudio.paused
    if (isSameAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      audioRef.current = null
      setPlayingAudioUrl(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio(resolvedAudioUrl)
    audioRef.current = audio
    setPlayingAudioUrl(resolvedAudioUrl)
    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingAudioUrl(null)
      }
    }

    try {
      await audio.play()
    } catch {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingAudioUrl(null)
      }
      gooeyToast.error(ADMIN_VOCABULARY_CONTENT.form.playAudioFailedLabel)
    }
  }

  return {
    isImportDialogOpen,
    keywordInput,
    levelInput,
    statusInput,
    wordTypeInput,
    createdByMeInput,
    hasAudioInput,
    playingAudioUrl,
    isLoading,
    isFetching,
    isDeleting: deleteMutation.isPending,
    pendingDeleteItem,
    setPendingDeleteItem,
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
    handleOpenImport,
    handleCloseImport,
    handleDownloadTemplate,
    handleExportJson,
    handleDelete,
    handleConfirmDelete,
    handlePlayAudio,
  }
}
