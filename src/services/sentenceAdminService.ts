import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { SentenceAdminItem, SentenceSearchQuery, SentenceUpsertPayload } from '@/types/sentenceAdmin'

export const sentenceAdminService = {
  search(query: SentenceSearchQuery) {
    return api.get<ApiResponse<SentenceAdminItem[]>>('/sentences', {
      params: {
        q: query.q,
        level: query.level,
        createdByMe: query.createdByMe,
        hasAudio: query.hasAudio,
        page: query.page,
        pageSize: query.pageSize,
      },
    })
  },

  getById(id: string) {
    return api.get<ApiResponse<SentenceAdminItem>>(`/sentences/${id}`)
  },

  create(payload: SentenceUpsertPayload) {
    return api.post<ApiResponse<SentenceAdminItem>>('/sentences', payload)
  },

  update(id: string, payload: SentenceUpsertPayload) {
    return api.patch<ApiResponse<SentenceAdminItem>>(`/sentences/${id}`, payload)
  },

  remove(id: string) {
    return api.delete<ApiResponse<boolean>>(`/sentences/${id}`)
  },
}
