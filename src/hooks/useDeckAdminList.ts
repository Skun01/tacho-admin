import { useQuery } from '@tanstack/react-query'
import { deckAdminService } from '@/services/deckAdminService'
import type { AdminDeckSearchQuery } from '@/types/deckAdmin'

export const DECK_ADMIN_QUERY_KEYS = {
  all: ['admin', 'decks'] as const,
  list: (query: AdminDeckSearchQuery) => [...DECK_ADMIN_QUERY_KEYS.all, 'list', query] as const,
  detail: (deckId: string) => [...DECK_ADMIN_QUERY_KEYS.all, 'detail', deckId] as const,
}

export function useDeckAdminList(query: AdminDeckSearchQuery) {
  return useQuery({
    queryKey: DECK_ADMIN_QUERY_KEYS.list(query),
    queryFn: () => deckAdminService.getDecks(query),
  })
}
