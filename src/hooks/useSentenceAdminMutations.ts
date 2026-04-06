import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { SentenceUpsertPayload } from '@/types/sentenceAdmin'

export function useSentenceAdminMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'sentences'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: SentenceUpsertPayload) => sentenceAdminService.create(payload),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SentenceUpsertPayload }) => sentenceAdminService.update(id, payload),
    onSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sentenceAdminService.remove(id),
    onSuccess,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
