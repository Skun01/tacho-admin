import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import { useLearningIssues } from '@/hooks/useLearningAdminQueries'
import type {
  CardType,
  LearningAdminIssuesQuery,
  LearningIssueType,
  StudyMode,
} from '@/types/learningAdmin'

const PAGE_SIZE = 20

export function useAdminLearningIssuesPageState() {
  const [keywordInput, setKeywordInput] = useState('')
  const [cardTypeInput, setCardTypeInput] = useState<CardType | undefined>(undefined)
  const [modeInput, setModeInput] = useState<StudyMode | undefined>(undefined)
  const [issueTypeInput, setIssueTypeInput] = useState<LearningIssueType | undefined>(undefined)
  const [deckIdInput, setDeckIdInput] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState<LearningAdminIssuesQuery>({ page: 1, pageSize: PAGE_SIZE })
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const listQuery = useLearningIssues(query)

  useEffect(() => {
    if (!listQuery.isError) return
    gooeyToast.error(ADMIN_LEARNING_CONTENT.toast.loadError)
  }, [listQuery.isError])

  const items = listQuery.data?.items ?? []
  const meta = listQuery.data?.meta
  const totalItems = meta?.total ?? items.length
  const currentPage = meta?.page ?? query.page ?? 1
  const totalPage = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1

  const handleSearch = () => {
    setQuery({
      q: keywordInput.trim() || undefined,
      cardType: cardTypeInput,
      mode: modeInput,
      issueType: issueTypeInput,
      deckId: deckIdInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setCardTypeInput(undefined)
    setModeInput(undefined)
    setIssueTypeInput(undefined)
    setDeckIdInput(undefined)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }))
  }

  return {
    keywordInput,
    cardTypeInput,
    modeInput,
    issueTypeInput,
    deckIdInput,
    items,
    totalItems,
    currentPage,
    totalPage,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    selectedCardId,
    setKeywordInput,
    setCardTypeInput,
    setModeInput,
    setIssueTypeInput,
    setDeckIdInput,
    setSelectedCardId,
    handleSearch,
    handleReset,
    handlePageChange,
  }
}
