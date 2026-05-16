import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CONVERSATION_SCENARIO_ERROR_MESSAGES } from '@/constants/conversationScenario'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { conversationScenarioService } from '@/services/conversationScenarioService'
import { CONVERSATION_SCENARIO_QUERY_KEYS } from './useConversationScenarioQueries'
import type {
  CreateConversationScenarioPayload,
  UpdateConversationScenarioPayload,
} from '@/types/conversationScenario'

export function useConversationScenarioMutations() {
  const queryClient = useQueryClient()

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: CONVERSATION_SCENARIO_QUERY_KEYS.all })

  const createMutation = useMutation({
    mutationFn: (payload: CreateConversationScenarioPayload) => conversationScenarioService.create(payload),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateConversationScenarioPayload }) =>
      conversationScenarioService.update(id, payload),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => conversationScenarioService.remove(id),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    getApiErrorMessage: (error: unknown, fallback: string) =>
      getSafeApiErrorMessage(error, fallback, CONVERSATION_SCENARIO_ERROR_MESSAGES),
  }
}
