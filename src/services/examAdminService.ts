import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { ExamImportCommitResult, ExamImportPreviewResult, ImportExamRequest } from '@/types/jlptAdmin'

export const examAdminService = {
  getImportTemplate() {
    return api.get<Blob>('/exams/import-template', { responseType: 'blob' })
  },

  getImportGuide() {
    return api.get<Blob>('/exams/import-guide', { responseType: 'blob' })
  },

  exportExam(id: string) {
    return api.get<Blob>(`/exams/${id}/export`, { responseType: 'blob' })
  },

  importPreview(payload: ImportExamRequest) {
    return api.post<ApiResponse<ExamImportPreviewResult>>('/exams/preview-import', payload)
  },

  importCommit(payload: ImportExamRequest) {
    return api.post<ApiResponse<ExamImportCommitResult>>('/exams/commit-import', payload)
  },
}