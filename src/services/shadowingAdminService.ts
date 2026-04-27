import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AttachBulkShadowingSentenceRequest,
  AttachShadowingSentencePayload,
  AvailableSentenceListResult,
  AvailableSentenceResponse,
  CreateShadowingTopicPayload,
  ReorderTopicSentencesPayload,
  SearchAvailableSentencesQuery,
  SearchShadowingTopicsQuery,
  ShadowingTopicAnalyticsResponse,
  ShadowingTopicDetailResponse,
  ShadowingTopicListItemResponse,
  ShadowingTopicListResult,
  ShadowingTopicSentenceResponse,
  ShadowingSentenceAnalyticsResponse,
  UpdateShadowingTopicPayload,
  UpdateTopicSentencePayload,
} from '@/types/shadowingAdmin'

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

export const shadowingAdminService = {
  // ── Topic CRUD ───────────────────────────────────────────────────────────────

  async searchTopics(query: SearchShadowingTopicsQuery): Promise<ShadowingTopicListResult> {
    const response = await api.get<PaginatedResponse<ShadowingTopicListItemResponse>>('/admin/shadowing/topics', {
      params: omitNullishValues({
        q: query.q,
        level: query.level,
        visibility: query.visibility,
        status: query.status,
        isOfficial: query.isOfficial,
        createdBy: query.createdBy,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapPaginatedResponse(response.data)
  },

  async getTopicDetail(topicId: string): Promise<ShadowingTopicDetailResponse> {
    const response = await api.get<ApiResponse<ShadowingTopicDetailResponse>>(`/admin/shadowing/topics/${topicId}`)
    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }
    return response.data.data
  },

  async createTopic(payload: CreateShadowingTopicPayload): Promise<ShadowingTopicDetailResponse> {
    const response = await api.post<ApiResponse<ShadowingTopicDetailResponse>>('/admin/shadowing/topics', payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateTopic(topicId: string, payload: UpdateShadowingTopicPayload): Promise<ShadowingTopicDetailResponse> {
    const response = await api.patch<ApiResponse<ShadowingTopicDetailResponse>>(`/admin/shadowing/topics/${topicId}`, payload)
    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }
    return response.data.data
  },

  async deleteTopic(topicId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/shadowing/topics/${topicId}`)
    return response.data.data === true
  },

  // ── Available Sentences ─────────────────────────────────────────────────────

  async searchAvailableSentences(
    topicId: string,
    query: SearchAvailableSentencesQuery,
  ): Promise<AvailableSentenceListResult> {
    const response = await api.get<PaginatedResponse<AvailableSentenceResponse>>(
      `/admin/shadowing/topics/${topicId}/available-sentences`,
      {
        params: omitNullishValues({
          q: query.q,
          level: query.level,
          hasAudio: query.hasAudio,
          page: query.page,
          pageSize: query.pageSize,
        }),
      },
    )
    return mapPaginatedResponse(response.data)
  },

  // ── Topic Sentences Management ───────────────────────────────────────────────

  async attachSentence(topicId: string, payload: AttachShadowingSentencePayload): Promise<ShadowingTopicSentenceResponse> {
    const response = await api.post<ApiResponse<ShadowingTopicSentenceResponse>>(
      `/admin/shadowing/topics/${topicId}/sentences`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Shadowing_SentenceAlreadyAttached_400')
    }
    return response.data.data
  },

  async attachBulkSentences(
    topicId: string,
    payload: AttachBulkShadowingSentenceRequest,
  ): Promise<ShadowingTopicSentenceResponse[]> {
    const response = await api.post<ApiResponse<ShadowingTopicSentenceResponse[]>>(
      `/admin/shadowing/topics/${topicId}/sentences/bulk`,
      payload,
    )
    return response.data.data ?? []
  },

  async updateTopicSentence(
    topicId: string,
    sentenceId: string,
    payload: UpdateTopicSentencePayload,
  ): Promise<ShadowingTopicSentenceResponse> {
    const response = await api.put<ApiResponse<ShadowingTopicSentenceResponse>>(
      `/admin/shadowing/topics/${topicId}/sentences/${sentenceId}`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Shadowing_SentenceNotAttached_404')
    }
    return response.data.data
  },

  async removeSentence(topicId: string, sentenceId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(
      `/admin/shadowing/topics/${topicId}/sentences/${sentenceId}`,
    )
    return response.data.data === true
  },

  async reorderSentences(topicId: string, payload: ReorderTopicSentencesPayload): Promise<ShadowingTopicSentenceResponse[]> {
    const response = await api.post<ApiResponse<ShadowingTopicSentenceResponse[]>>(
      `/admin/shadowing/topics/${topicId}/sentences/reorder`,
      payload,
    )
    return response.data.data ?? []
  },

  // ── Analytics ─────────────────────────────────────────────────────────────────

  async getTopicAnalytics(topicId: string): Promise<ShadowingTopicAnalyticsResponse> {
    const response = await api.get<ApiResponse<ShadowingTopicAnalyticsResponse>>(
      `/admin/shadowing/topics/${topicId}/analytics`,
    )
    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }
    return response.data.data
  },

  async getSentenceAnalytics(topicId: string): Promise<ShadowingSentenceAnalyticsResponse[]> {
    const response = await api.get<ApiResponse<ShadowingSentenceAnalyticsResponse[]>>(
      `/admin/shadowing/topics/${topicId}/analytics/sentences`,
    )
    return response.data.data ?? []
  },
}
