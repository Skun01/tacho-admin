import { useMutation } from '@tanstack/react-query'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'

export function useVocabularyAdminDetail() {
  const detailMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await vocabularyAdminService.getById(id)
      return response.data
    },
  })

  return {
    fetchDetail: detailMutation.mutateAsync,
    isLoadingDetail: detailMutation.isPending,
  }
}