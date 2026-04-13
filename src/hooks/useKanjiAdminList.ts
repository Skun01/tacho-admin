import { useQuery } from '@tanstack/react-query'
import { kanjiAdminService } from '@/services/kanjiAdminService'
import type { KanjiSearchQuery } from '@/types/kanjiAdmin'

export function useKanjiAdminList(query: KanjiSearchQuery) {
  return useQuery({
    queryKey: ['admin', 'kanji', query],
    queryFn: async () => {
      const { data } = await kanjiAdminService.search(query)
      return data
    },
  })
}
