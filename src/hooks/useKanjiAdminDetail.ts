import { useMutation } from '@tanstack/react-query'
import { kanjiAdminService } from '@/services/kanjiAdminService'

export function useKanjiAdminDetail() {
  const detailMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await kanjiAdminService.getById(id)
      return response.data
    },
  })

  return {
    fetchDetail: detailMutation.mutateAsync,
    isLoadingDetail: detailMutation.isPending,
  }
}
