import { useMutation } from '@tanstack/react-query'
import { grammarAdminService } from '@/services/grammarAdminService'

export function useGrammarAdminDetail() {
  const detailMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await grammarAdminService.getById(id)
      return response.data
    },
  })

  return {
    fetchDetail: detailMutation.mutateAsync,
    isLoadingDetail: detailMutation.isPending,
  }
}
