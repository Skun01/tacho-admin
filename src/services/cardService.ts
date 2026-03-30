import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AnyCard,
  CardListItem,
  CardType,
  JlptLevel,
  CreateVocabCardDTO,
  CreateGrammarCardDTO,
} from '@/types/card'
import api from './api'

export interface CardListParams {
  page?: number
  limit?: number
  type?: CardType
  jlptLevel?: JlptLevel
  search?: string
  includeDeleted?: boolean
}

export const cardService = {
  list: (params?: CardListParams) =>
    api.get<PaginatedResponse<CardListItem>>('/admin/cards', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<AnyCard>>(`/admin/cards/${id}`),

  createVocab: (dto: CreateVocabCardDTO) =>
    api.post<ApiResponse<AnyCard>>('/admin/cards/vocab', dto),

  createGrammar: (dto: CreateGrammarCardDTO) =>
    api.post<ApiResponse<AnyCard>>('/admin/cards/grammar', dto),

  updateVocab: (id: string, dto: Partial<CreateVocabCardDTO>) =>
    api.patch<ApiResponse<AnyCard>>(`/admin/cards/vocab/${id}`, dto),

  updateGrammar: (id: string, dto: Partial<CreateGrammarCardDTO>) =>
    api.patch<ApiResponse<AnyCard>>(`/admin/cards/grammar/${id}`, dto),

  softDelete: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/cards/${id}`),

  restore: (id: string) =>
    api.patch<ApiResponse<null>>(`/admin/cards/${id}/restore`),

  addExample: (cardId: string, payload: { japanese: string; vietnamese: string; jlptLevel?: JlptLevel; isAboutExample?: boolean }) =>
    api.post<ApiResponse<{ id: string }>>(`/admin/cards/${cardId}/examples`, payload),

  deleteExample: (cardId: string, exampleId: string) =>
    api.delete<ApiResponse<null>>(`/admin/cards/${cardId}/examples/${exampleId}`),

  addDictEntry: (cardId: string, payload: { partOfSpeech: string; definitions: string[] }) =>
    api.post<ApiResponse<{ id: string }>>(`/admin/cards/${cardId}/dict-entries`, payload),

  deleteDictEntry: (cardId: string, entryId: string) =>
    api.delete<ApiResponse<null>>(`/admin/cards/${cardId}/dict-entries/${entryId}`),

  addGrammarLink: (cardId: string, payload: { linkedCardId: string; linkType: 'antonym' | 'related' }) =>
    api.post<ApiResponse<{ id: string }>>(`/admin/cards/${cardId}/grammar-links`, payload),

  deleteGrammarLink: (cardId: string, linkId: string) =>
    api.delete<ApiResponse<null>>(`/admin/cards/${cardId}/grammar-links/${linkId}`),
}
