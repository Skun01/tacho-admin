import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { grammarAdminService } from '@/services/grammarAdminService'
import type { GrammarUpsertPayload } from '@/types/grammarAdmin'

export function useGrammarAdminMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'grammar'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: GrammarUpsertPayload) => grammarAdminService.create(payload),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GrammarUpsertPayload }) => grammarAdminService.update(id, payload),
    onSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => grammarAdminService.remove(id),
    onSuccess,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
