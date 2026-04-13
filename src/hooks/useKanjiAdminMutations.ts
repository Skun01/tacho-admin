import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { kanjiAdminService } from '@/services/kanjiAdminService'
import type { KanjiUpsertPayload } from '@/types/kanjiAdmin'

export function useKanjiAdminMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'kanji'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: KanjiUpsertPayload) => kanjiAdminService.create(payload),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: KanjiUpsertPayload }) => kanjiAdminService.update(id, payload),
    onSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => kanjiAdminService.remove(id),
    onSuccess,
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
