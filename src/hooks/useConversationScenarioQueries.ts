import { useQuery } from '@tanstack/react-query'
import { conversationScenarioService } from '@/services/conversationScenarioService'

export const CONVERSATION_SCENARIO_QUERY_KEYS = {
  all: ['admin', 'conversation-scenarios'] as const,
  detail: (id: string) => ['admin', 'conversation-scenarios', id] as const,
}

export function useConversationScenarioList() {
  return useQuery({
    queryKey: CONVERSATION_SCENARIO_QUERY_KEYS.all,
    queryFn: () => conversationScenarioService.getAll(),
  })
}

export function useConversationScenarioDetail(id: string | undefined) {
  return useQuery({
    queryKey: CONVERSATION_SCENARIO_QUERY_KEYS.detail(id!),
    queryFn: () => conversationScenarioService.getById(id!),
    enabled: !!id,
  })
}
