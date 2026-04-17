import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DECK_ADMIN_ERROR_MESSAGES } from '@/constants/adminDeck'
import { DECK_ADMIN_QUERY_KEYS } from '@/hooks/useDeckAdminList'
import { DECK_TYPE_ADMIN_QUERY_KEYS } from '@/hooks/useDeckTypeAdminList'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { deckTypeAdminService } from '@/services/deckTypeAdminService'
import type { DeckTypeUpsertPayload } from '@/types/deckAdmin'

export function useDeckTypeAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateTypeQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: DECK_TYPE_ADMIN_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: DECK_ADMIN_QUERY_KEYS.all }),
    ])

  const createMutation = useMutation({
    mutationFn: (payload: DeckTypeUpsertPayload) => deckTypeAdminService.createDeckType(payload),
    onSuccess: async () => {
      await invalidateTypeQueries()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeckTypeUpsertPayload }) =>
      deckTypeAdminService.updateDeckType(id, payload),
    onSuccess: async () => {
      await invalidateTypeQueries()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deckTypeAdminService.deleteDeckType(id),
    onSuccess: async () => {
      await invalidateTypeQueries()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: (error: unknown, fallback: string) =>
      getSafeApiErrorMessage(error, fallback, DECK_ADMIN_ERROR_MESSAGES),
  }
}
