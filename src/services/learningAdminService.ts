import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AttachSentencePayload,
  CardAnalyticsResponse,
  DeckAnalyticsResponse,
  DeckCoverageResponse,
  LearningAdminCardConfigResponse,
  LearningAdminCardSentenceConfigResponse,
  LearningAdminIssueListItemResponse,
  LearningAdminIssuesQuery,
  LearningOverviewResponse,
  LearningPreviewQuery,
  LearningPreviewResponse,
  ReorderSentencesPayload,
  UpdateCardConfigPayload,
  UpdateSentenceRelationPayload,
  UserProgressResponse,
} from '@/types/learningAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

export const learningAdminService = {
  // ── 15.3  Card config ─────────────────────────
  async getCardConfig(cardId: string): Promise<LearningAdminCardConfigResponse> {
    const response = await api.get<ApiResponse<LearningAdminCardConfigResponse>>(
      `/admin/learning/cards/${cardId}/config`,
    )
    if (!response.data.data) throw new Error('Learning_CardNotFound_404')
    return response.data.data
  },

  // ── 15.4  Update card config ──────────────────
  async updateCardConfig(cardId: string, payload: UpdateCardConfigPayload): Promise<LearningAdminCardConfigResponse> {
    const response = await api.put<ApiResponse<LearningAdminCardConfigResponse>>(
      `/admin/learning/cards/${cardId}/config`,
      payload,
    )
    if (!response.data.data) throw new Error('Common_400')
    return response.data.data
  },

  // ── 15.5  Attach sentence ─────────────────────
  async attachSentence(
    cardId: string,
    payload: AttachSentencePayload,
  ): Promise<LearningAdminCardSentenceConfigResponse> {
    const response = await api.post<ApiResponse<LearningAdminCardSentenceConfigResponse>>(
      `/admin/learning/cards/${cardId}/sentences`,
      payload,
    )
    if (!response.data.data) throw new Error('Common_400')
    return response.data.data
  },

  // ── 15.6  Update sentence relation ────────────
  async updateSentenceRelation(
    cardId: string,
    sentenceId: string,
    payload: UpdateSentenceRelationPayload,
  ): Promise<LearningAdminCardSentenceConfigResponse> {
    const response = await api.put<ApiResponse<LearningAdminCardSentenceConfigResponse>>(
      `/admin/learning/cards/${cardId}/sentences/${sentenceId}`,
      payload,
    )
    if (!response.data.data) throw new Error('Learning_SentenceNotAttached_404')
    return response.data.data
  },

  // ── 15.7  Remove sentence relation ────────────
  async removeSentenceRelation(cardId: string, sentenceId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(
      `/admin/learning/cards/${cardId}/sentences/${sentenceId}`,
    )
    return response.data.data === true
  },

  // ── 15.8  Reorder sentences ───────────────────
  async reorderSentences(
    cardId: string,
    payload: ReorderSentencesPayload,
  ): Promise<LearningAdminCardSentenceConfigResponse[]> {
    const response = await api.post<ApiResponse<LearningAdminCardSentenceConfigResponse[]>>(
      `/admin/learning/cards/${cardId}/sentences/reorder`,
      payload,
    )
    return response.data.data ?? []
  },

  // ── 15.9  Issues list ─────────────────────────
  async getIssues(query: LearningAdminIssuesQuery) {
    const response = await api.get<PaginatedResponse<LearningAdminIssueListItemResponse>>(
      '/admin/learning/cards/issues',
      {
        params: omitNullishValues({
          page: query.page,
          pageSize: query.pageSize,
          cardType: query.cardType,
          mode: query.mode,
          issueType: query.issueType,
          q: query.q,
          deckId: query.deckId,
        }),
      },
    )
    return {
      items: response.data.data ?? [],
      meta: response.data.metaData ?? null,
    }
  },

  // ── 15.10 Deck coverage ───────────────────────
  async getDeckCoverage(deckId: string): Promise<DeckCoverageResponse> {
    const response = await api.get<ApiResponse<DeckCoverageResponse>>(
      `/admin/learning/decks/${deckId}/coverage`,
    )
    if (!response.data.data) throw new Error('Deck_NotFound_404')
    return response.data.data
  },

  // ── 15.11 Overview ────────────────────────────
  async getOverview(): Promise<LearningOverviewResponse> {
    const response = await api.get<ApiResponse<LearningOverviewResponse>>(
      '/admin/learning/overview',
    )
    if (!response.data.data) throw new Error('Common_500')
    return response.data.data
  },

  // ── 15.12 Deck analytics ──────────────────────
  async getDeckAnalytics(deckId: string): Promise<DeckAnalyticsResponse> {
    const response = await api.get<ApiResponse<DeckAnalyticsResponse>>(
      `/admin/learning/decks/${deckId}/analytics`,
    )
    if (!response.data.data) throw new Error('Deck_NotFound_404')
    return response.data.data
  },

  // ── 15.13 Card analytics ──────────────────────
  async getCardAnalytics(cardId: string): Promise<CardAnalyticsResponse> {
    const response = await api.get<ApiResponse<CardAnalyticsResponse>>(
      `/admin/learning/cards/${cardId}/analytics`,
    )
    if (!response.data.data) throw new Error('Learning_CardNotFound_404')
    return response.data.data
  },

  // ── 15.14 User progress ───────────────────────
  async getUserProgress(userId: string): Promise<UserProgressResponse> {
    const response = await api.get<ApiResponse<UserProgressResponse>>(
      `/admin/learning/users/${userId}/progress`,
    )
    if (!response.data.data) throw new Error('Common_404')
    return response.data.data
  },

  // ── 15.15 Card preview ────────────────────────
  async getCardPreview(cardId: string, query: LearningPreviewQuery): Promise<LearningPreviewResponse> {
    const response = await api.get<ApiResponse<LearningPreviewResponse>>(
      `/admin/learning/cards/${cardId}/preview`,
      {
        params: omitNullishValues({
          mode: query.mode,
          multipleChoiceQuestion: query.multipleChoiceQuestion,
          flashcardFront: query.flashcardFront,
          flashcardBack: query.flashcardBack,
          shuffleOptions: query.shuffleOptions,
        }),
      },
    )
    if (!response.data.data) throw new Error('Learning_CardNotFound_404')
    return response.data.data
  },
}
