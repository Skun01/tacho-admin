import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type {
  KanjiAdminDetail,
  KanjiAdminItem,
  KanjiImportCommitResult,
  KanjiImportPayload,
  KanjiImportPreviewResult,
  KanjiSearchQuery,
  KanjiUpsertPayload,
} from '@/types/kanjiAdmin'

export const kanjiAdminService = {
  search(query: KanjiSearchQuery) {
    return api.get<ApiResponse<KanjiAdminItem[]>>('/kanji', {
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        strokeCountMin: query.strokeCountMin,
        strokeCountMax: query.strokeCountMax,
        radical: query.radical,
        createdByMe: query.createdByMe,
        page: query.page,
        pageSize: query.pageSize,
      },
    })
  },

  getById(id: string) {
    return api.get<ApiResponse<KanjiAdminDetail>>(`/kanji/${id}`)
  },

  create(payload: KanjiUpsertPayload) {
    return api.post<ApiResponse<KanjiAdminItem>>('/kanji', payload)
  },

  update(id: string, payload: KanjiUpsertPayload) {
    return api.patch<ApiResponse<KanjiAdminItem>>(`/kanji/${id}`, payload)
  },

  remove(id: string) {
    return api.delete<ApiResponse<boolean>>(`/kanji/${id}`)
  },

  getImportTemplate() {
    return api.get<Blob>('/kanji/import-template', { responseType: 'blob' })
  },

  exportJson(query: KanjiSearchQuery) {
    return api.get<Blob>('/kanji/export', {
      responseType: 'blob',
      params: {
        q: query.q,
        level: query.level,
        status: query.status,
        strokeCountMin: query.strokeCountMin,
        strokeCountMax: query.strokeCountMax,
        radical: query.radical,
        createdByMe: query.createdByMe,
      },
    })
  },

  importPreview(payload: KanjiImportPayload) {
    return api.post<ApiResponse<KanjiImportPreviewResult>>('/kanji/import/preview', payload)
  },

  importCommit(payload: KanjiImportPayload) {
    return api.post<ApiResponse<KanjiImportCommitResult>>('/kanji/import/commit', payload)
  },
}
