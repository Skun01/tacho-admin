import { useQuery } from '@tanstack/react-query'
import { deckTypeAdminService } from '@/services/deckTypeAdminService'
import type { AdminDeckTypeSearchQuery } from '@/types/deckAdmin'

export const DECK_TYPE_ADMIN_QUERY_KEYS = {
  all: ['admin', 'deck-types'] as const,
  list: (query: AdminDeckTypeSearchQuery) => [...DECK_TYPE_ADMIN_QUERY_KEYS.all, 'list', query] as const,
  detail: (id: string) => [...DECK_TYPE_ADMIN_QUERY_KEYS.all, 'detail', id] as const,
}

export function useDeckTypeAdminList(query: AdminDeckTypeSearchQuery) {
  return useQuery({
    queryKey: DECK_TYPE_ADMIN_QUERY_KEYS.list(query),
    queryFn: () => deckTypeAdminService.getDeckTypes(query),
  })
}
