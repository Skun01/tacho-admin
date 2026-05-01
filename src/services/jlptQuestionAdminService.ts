import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  BulkCreateQuestionsPayload,
  CreateQuestionPayload,
  QuestionListResult,
  QuestionResponse,
  ReorderQuestionsPayload,
  SearchQuestionsQuery,
  UpdateQuestionPayload,
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

export const jlptQuestionAdminService = {
  async searchQuestions(query: SearchQuestionsQuery): Promise<QuestionListResult> {
    const response = await api.get<PaginatedResponse<QuestionResponse>>('/questions', {
      params: omitNullishValues({
        keyword: query.keyword,
        level: query.level,
        sectionType: query.sectionType,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapPaginatedResponse(response.data)
  },

  async getQuestion(id: string): Promise<QuestionResponse> {
    const response = await api.get<ApiResponse<QuestionResponse>>(`/questions/${id}`)
    if (!response.data.data) {
      throw new Error('Question_NotFound_404')
    }
    return response.data.data
  },

  async createQuestion(payload: CreateQuestionPayload): Promise<QuestionResponse> {
    const response = await api.post<ApiResponse<QuestionResponse>>('/questions', payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateQuestion(id: string, payload: UpdateQuestionPayload): Promise<QuestionResponse> {
    const response = await api.put<ApiResponse<QuestionResponse>>(`/questions/${id}`, payload)
    if (!response.data.data) {
      throw new Error('Question_NotFound_404')
    }
    return response.data.data
  },

  async deleteQuestion(id: string): Promise<string> {
    const response = await api.delete<ApiResponse<string>>(`/questions/${id}`)
    return response.data.data
  },

  async bulkCreateQuestions(groupId: string, payload: BulkCreateQuestionsPayload): Promise<QuestionResponse[]> {
    const response = await api.post<ApiResponse<QuestionResponse[]>>(`/questions/groups/${groupId}/bulk`, payload)
    return response.data.data ?? []
  },

  async reorderQuestions(groupId: string, payload: ReorderQuestionsPayload): Promise<string> {
    const response = await api.put<ApiResponse<string>>(`/questions/groups/${groupId}/reorder`, payload)
    return response.data.data
  },
}
