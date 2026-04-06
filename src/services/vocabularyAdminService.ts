import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { VocabularyAdminDetail, VocabularyAdminItem, VocabularySearchQuery, VocabularyUpsertPayload } from '@/types/vocabularyAdmin'

export const vocabularyAdminService = {
  search(query: VocabularySearchQuery) {
    return api.get<ApiResponse<VocabularyAdminItem[]>>('/vocabulary', {
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        createdByMe: query.createdByMe,
        page: query.page,
        pageSize: query.pageSize,
      },
    })
  },

  getById(id: string) {
    return api.get<ApiResponse<VocabularyAdminDetail>>(`/vocabulary/${id}`)
  },

  create(payload: VocabularyUpsertPayload) {
    return api.post<ApiResponse<VocabularyAdminItem>>('/vocabulary', payload)
  },

  update(id: string, payload: VocabularyUpsertPayload) {
    return api.patch<ApiResponse<VocabularyAdminItem>>(`/vocabulary/${id}`, payload)
  },

  remove(id: string) {
    return api.delete<ApiResponse<boolean>>(`/vocabulary/${id}`)
  },
}
