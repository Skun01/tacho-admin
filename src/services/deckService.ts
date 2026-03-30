import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Deck, DeckDetail, CreateDeckDTO, ReorderCardsDTO } from '@/types/deck'
import api from './api'

export interface DeckListParams {
  page?: number
  limit?: number
  search?: string
  deckType?: 'app' | 'textbook'
}

export const deckService = {
  list: (params?: DeckListParams) =>
    api.get<PaginatedResponse<Deck>>('/admin/decks', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<DeckDetail>>(`/admin/decks/${id}`),

  create: (dto: CreateDeckDTO) =>
    api.post<ApiResponse<Deck>>('/admin/decks', dto),

  update: (id: string, dto: Partial<CreateDeckDTO>) =>
    api.patch<ApiResponse<Deck>>(`/admin/decks/${id}`, dto),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/decks/${id}`),

  addCard: (deckId: string, cardId: string) =>
    api.post<ApiResponse<null>>(`/admin/decks/${deckId}/cards`, { cardId }),

  removeCard: (deckId: string, cardId: string) =>
    api.delete<ApiResponse<null>>(`/admin/decks/${deckId}/cards/${cardId}`),

  reorderCards: (deckId: string, dto: ReorderCardsDTO) =>
    api.patch<ApiResponse<null>>(`/admin/decks/${deckId}/cards/reorder`, dto),
}
