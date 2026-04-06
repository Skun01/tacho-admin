import { useQuery } from '@tanstack/react-query'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'
import type { VocabularySearchQuery } from '@/types/vocabularyAdmin'

export function useVocabularyAdminList(query: VocabularySearchQuery) {
  return useQuery({
    queryKey: ['admin', 'vocabulary', query],
    queryFn: async () => {
      const { data } = await vocabularyAdminService.search(query)
      return data
    },
  })
}
