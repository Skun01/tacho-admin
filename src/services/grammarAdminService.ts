import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type {
  GrammarAdminDetail,
  GrammarAdminItem,
  GrammarImportCommitResult,
  GrammarImportPayload,
  GrammarImportPreviewResult,
  GrammarSearchQuery,
  GrammarUpsertPayload,
} from '@/types/grammarAdmin'

export const grammarAdminService = {
  search(query: GrammarSearchQuery) {
    return api.get<ApiResponse<GrammarAdminItem[]>>('/grammar', {
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        register: query.register,
        createdByMe: query.createdByMe,
        page: query.page,
        pageSize: query.pageSize,
      },
    })
  },

  getById(id: string) {
    return api.get<ApiResponse<GrammarAdminDetail>>(`/grammar/${id}`)
  },

  create(payload: GrammarUpsertPayload) {
    return api.post<ApiResponse<GrammarAdminItem>>('/grammar', payload)
  },

  update(id: string, payload: GrammarUpsertPayload) {
    return api.patch<ApiResponse<GrammarAdminItem>>(`/grammar/${id}`, payload)
  },

  remove(id: string) {
    return api.delete<ApiResponse<boolean>>(`/grammar/${id}`)
  },

  getImportTemplate() {
    return api.get<Blob>('/grammar/import-template', { responseType: 'blob' })
  },

  exportJson(query: GrammarSearchQuery) {
    return api.get<Blob>('/grammar/export', {
      responseType: 'blob',
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        register: query.register,
        createdByMe: query.createdByMe,
      },
    })
  },

  importPreview(payload: GrammarImportPayload) {
    return api.post<ApiResponse<GrammarImportPreviewResult>>('/grammar/import/preview', payload)
  },

  importCommit(payload: GrammarImportPayload) {
    return api.post<ApiResponse<GrammarImportCommitResult>>('/grammar/import/commit', payload)
  },
}
