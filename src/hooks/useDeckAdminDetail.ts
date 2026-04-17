import { useQuery } from '@tanstack/react-query'
import { DECK_ADMIN_QUERY_KEYS } from '@/hooks/useDeckAdminList'
import { deckAdminService } from '@/services/deckAdminService'

export function useDeckAdminDetail(deckId: string, enabled = true) {
  return useQuery({
    queryKey: DECK_ADMIN_QUERY_KEYS.detail(deckId),
    queryFn: () => deckAdminService.getDeckDetail(deckId),
    enabled: enabled && Boolean(deckId),
  })
}
