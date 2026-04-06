import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'
import type { VocabularyUpsertPayload } from '@/types/vocabularyAdmin'

export function useVocabularyAdminMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'vocabulary'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: VocabularyUpsertPayload) => vocabularyAdminService.create(payload),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VocabularyUpsertPayload }) => vocabularyAdminService.update(id, payload),
    onSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vocabularyAdminService.remove(id),
    onSuccess,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
