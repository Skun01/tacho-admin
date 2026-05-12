import { useQuery } from '@tanstack/react-query'
import { cardSearchService } from '@/services/cardSearchService'
import type { AdminDeckSuggestByTopicQuery } from '@/types/deckAdmin'

export function useAdminDeckSuggestByTopic(query: AdminDeckSuggestByTopicQuery, enabled: boolean) {
  return useQuery({
    queryKey: ['admin', 'deck-suggest-by-topic', query],
    queryFn: async () => {
      const { data } = await cardSearchService.suggestByTopic(query)
      return data
    },
    enabled,
  })
}
