import { useQuery } from '@tanstack/react-query'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { SentenceSearchQuery } from '@/types/sentenceAdmin'

export function useSentenceAdminList(query: SentenceSearchQuery) {
  return useQuery({
    queryKey: ['admin', 'sentences', query],
    queryFn: async () => {
      const { data } = await sentenceAdminService.search(query)
      return data
    },
  })
}
