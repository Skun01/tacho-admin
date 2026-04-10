import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type {
  VocabularyAdminDetail,
  VocabularyAdminItem,
  VocabularyImportCommitResult,
  VocabularyImportPayload,
  VocabularyImportPreviewResult,
  VocabularySearchQuery,
  VocabularyUpsertPayload,
} from '@/types/vocabularyAdmin'

export const vocabularyAdminService = {
  search(query: VocabularySearchQuery) {
    return api.get<ApiResponse<VocabularyAdminItem[]>>('/vocabulary', {
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        wordType: query.wordType,
        createdByMe: query.createdByMe,
        hasAudio: query.hasAudio,
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

  getImportTemplate() {
    return api.get<Blob>('/vocabulary/import-template', { responseType: 'blob' })
  },

  exportJson(query: VocabularySearchQuery) {
    return api.get<Blob>('/vocabulary/export', {
      responseType: 'blob',
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        wordType: query.wordType,
        createdByMe: query.createdByMe,
        hasAudio: query.hasAudio,
      },
    })
  },

  importPreview(payload: VocabularyImportPayload) {
    return api.post<ApiResponse<VocabularyImportPreviewResult>>('/vocabulary/import/preview', payload)
  },

  importCommit(payload: VocabularyImportPayload) {
    return api.post<ApiResponse<VocabularyImportCommitResult>>('/vocabulary/import/commit', payload)
  },
}
