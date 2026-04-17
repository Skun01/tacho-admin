import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AdminDeckTypeListResult,
  AdminDeckTypeResponse,
  AdminDeckTypeSearchQuery,
  DeckTypeUpsertPayload,
} from '@/types/deckAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function mapDeckTypeListResponse(response: PaginatedResponse<AdminDeckTypeResponse>): AdminDeckTypeListResult {
  return {
    items: response.data ?? [],
    meta: response.metaData ?? null,
  }
}

export const deckTypeAdminService = {
  async getDeckTypes(query: AdminDeckTypeSearchQuery): Promise<AdminDeckTypeListResult> {
    const response = await api.get<PaginatedResponse<AdminDeckTypeResponse>>('/admin/deck-types', {
      params: omitNullishValues({
        q: query.q,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapDeckTypeListResponse(response.data)
  },

  async getDeckTypeDetail(id: string): Promise<AdminDeckTypeResponse> {
    const response = await api.get<ApiResponse<AdminDeckTypeResponse>>(`/admin/deck-types/${id}`)
    if (!response.data.data) {
      throw new Error('DeckType_NotFound_404')
    }
    return response.data.data
  },

  async createDeckType(payload: DeckTypeUpsertPayload): Promise<AdminDeckTypeResponse> {
    const response = await api.post<ApiResponse<AdminDeckTypeResponse>>('/admin/deck-types', payload)
    if (!response.data.data) {
      throw new Error('Common_400')
    }
    return response.data.data
  },

  async updateDeckType(id: string, payload: DeckTypeUpsertPayload): Promise<AdminDeckTypeResponse> {
    const response = await api.patch<ApiResponse<AdminDeckTypeResponse>>(`/admin/deck-types/${id}`, payload)
    if (!response.data.data) {
      throw new Error('DeckType_NotFound_404')
    }
    return response.data.data
  },

  async deleteDeckType(id: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/deck-types/${id}`)
    return response.data.data === true
  },
}
