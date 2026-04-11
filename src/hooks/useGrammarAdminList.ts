import { useQuery } from '@tanstack/react-query'
import { grammarAdminService } from '@/services/grammarAdminService'
import type { GrammarSearchQuery } from '@/types/grammarAdmin'

export function useGrammarAdminList(query: GrammarSearchQuery) {
  return useQuery({
    queryKey: ['admin', 'grammar', query],
    queryFn: async () => {
      const { data } = await grammarAdminService.search(query)
      return data
    },
  })
}
