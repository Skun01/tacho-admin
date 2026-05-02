import { useQueries } from '@tanstack/react-query'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'
import { grammarAdminService } from '@/services/grammarAdminService'
import { kanjiAdminService } from '@/services/kanjiAdminService'
import { deckAdminService } from '@/services/deckAdminService'

export interface AdminDashboardStats {
  vocabularyCount: number
  grammarCount: number
  kanjiCount: number
  deckCount: number
  isLoading: boolean
}

const ONE_MINUTE = 1000 * 60

export function useAdminDashboardStats(): AdminDashboardStats {
  const [vocabularyRes, grammarRes, kanjiRes, deckRes] = useQueries({
    queries: [
      {
        queryKey: ['admin', 'dashboard', 'vocabulary-count'],
        queryFn: async () => {
          const res = await vocabularyAdminService.search({ page: 1, pageSize: 1 })
          return res.data.metaData?.total ?? 0
        },
        staleTime: ONE_MINUTE,
      },
      {
        queryKey: ['admin', 'dashboard', 'grammar-count'],
        queryFn: async () => {
          const res = await grammarAdminService.search({ page: 1, pageSize: 1 })
          return res.data.metaData?.total ?? 0
        },
        staleTime: ONE_MINUTE,
      },
      {
        queryKey: ['admin', 'dashboard', 'kanji-count'],
        queryFn: async () => {
          const res = await kanjiAdminService.search({ page: 1, pageSize: 1 })
          return res.data.metaData?.total ?? 0
        },
        staleTime: ONE_MINUTE,
      },
      {
        queryKey: ['admin', 'dashboard', 'deck-count'],
        queryFn: async () => {
          const res = await deckAdminService.search({ page: 1, pageSize: 1 })
          return res.data.metaData?.total ?? 0
        },
        staleTime: ONE_MINUTE,
      },
    ],
  })

  return {
    vocabularyCount: vocabularyRes.data ?? 0,
    grammarCount: grammarRes.data ?? 0,
    kanjiCount: kanjiRes.data ?? 0,
    deckCount: deckRes.data ?? 0,
    isLoading: vocabularyRes.isLoading || grammarRes.isLoading || kanjiRes.isLoading || deckRes.isLoading,
  }
}