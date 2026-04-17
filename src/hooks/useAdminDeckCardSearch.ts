import { useQuery } from '@tanstack/react-query'
import { cardSearchService } from '@/services/cardSearchService'
import type { AdminDeckSearchCardsQuery } from '@/types/deckAdmin'

export function useAdminDeckCardSearch(query: AdminDeckSearchCardsQuery, enabled: boolean) {
  return useQuery({
    queryKey: ['admin', 'deck-card-search', query],
    queryFn: async () => {
      const { data } = await cardSearchService.search(query)
      return data
    },
    enabled,
  })
}
