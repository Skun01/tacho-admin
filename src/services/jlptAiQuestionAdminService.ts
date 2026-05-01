import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AiGeneratedQuestionResponse,
  AiQuestionListResult,
  GenerateAiQuestionsPayload,
  SearchAiQuestionsQuery,
  UpdateAiQuestionPayload,
} from '@/types/jlptAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function mapPaginatedResponse<T>(response: PaginatedResponse<T>): { items: T[]; meta: { total: number; page: number; pageSize: number } | null } {
  return {
    items: response.data ?? [],
    meta: response.metaData ?? null,
  }
}

export const jlptAiQuestionAdminService = {
  async generate(payload: GenerateAiQuestionsPayload): Promise<AiGeneratedQuestionResponse[]> {
    const response = await api.post<ApiResponse<AiGeneratedQuestionResponse[]>>('/ai/questions/generate', payload)
    return response.data.data ?? []
  },

  async searchAiQuestions(query: SearchAiQuestionsQuery): Promise<AiQuestionListResult> {
    const response = await api.get<PaginatedResponse<AiGeneratedQuestionResponse>>('/ai/questions', {
      params: omitNullishValues({
        level: query.level,
        sectionType: query.sectionType,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapPaginatedResponse(response.data)
  },

  async getAiQuestion(id: string): Promise<AiGeneratedQuestionResponse> {
    const response = await api.get<ApiResponse<AiGeneratedQuestionResponse>>(`/ai/questions/${id}`)
    if (!response.data.data) {
      throw new Error('AiQuestion_NotFound_404')
    }
    return response.data.data
  },

  async updateAiQuestion(id: string, payload: UpdateAiQuestionPayload): Promise<AiGeneratedQuestionResponse> {
    const response = await api.put<ApiResponse<AiGeneratedQuestionResponse>>(`/ai/questions/${id}`, payload)
    if (!response.data.data) {
      throw new Error('AiQuestion_NotFound_404')
    }
    return response.data.data
  },

  async approveAiQuestion(id: string): Promise<AiGeneratedQuestionResponse> {
    const response = await api.post<ApiResponse<AiGeneratedQuestionResponse>>(`/ai/questions/${id}/approve`)
    if (!response.data.data) {
      throw new Error('AiQuestion_NotFound_404')
    }
    return response.data.data
  },

  async rejectAiQuestion(id: string): Promise<AiGeneratedQuestionResponse> {
    const response = await api.post<ApiResponse<AiGeneratedQuestionResponse>>(`/ai/questions/${id}/reject`)
    if (!response.data.data) {
      throw new Error('AiQuestion_NotFound_404')
    }
    return response.data.data
  },
}
