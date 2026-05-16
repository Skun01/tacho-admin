import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type {
  ConversationScenarioResponse,
  CreateConversationScenarioPayload,
  UpdateConversationScenarioPayload,
} from '@/types/conversationScenario'

export const conversationScenarioService = {
  async getAll(): Promise<ConversationScenarioResponse[]> {
    const response = await api.get<ApiResponse<ConversationScenarioResponse[]>>('/admin/conversation-scenarios')
    return response.data.data ?? []
  },

  async getById(id: string): Promise<ConversationScenarioResponse> {
    const response = await api.get<ApiResponse<ConversationScenarioResponse>>(`/admin/conversation-scenarios/${id}`)
    if (!response.data.data) {
      throw new Error('ConversationScenario_NotFound_404')
    }
    return response.data.data
  },

  async create(payload: CreateConversationScenarioPayload): Promise<ConversationScenarioResponse> {
    const response = await api.post<ApiResponse<ConversationScenarioResponse>>('/admin/conversation-scenarios', payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async update(id: string, payload: UpdateConversationScenarioPayload): Promise<ConversationScenarioResponse> {
    const response = await api.patch<ApiResponse<ConversationScenarioResponse>>(`/admin/conversation-scenarios/${id}`, payload)
    if (!response.data.data) {
      throw new Error('ConversationScenario_NotFound_404')
    }
    return response.data.data
  },

  async remove(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/conversation-scenarios/${id}`)
    return response.data.data === true
  },
}
