import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  CreateExamPayload,
  CreateQuestionGroupPayload,
  CreateSectionPayload,
  ExamDetailResponse,
  ExamListItemResponse,
  ExamListResult,
  QuestionGroupResponse,
  ExamSectionResponse,
  SearchExamsQuery,
  UpdateExamPayload,
  UpdateQuestionGroupPayload,
  UpdateSectionPayload,
} from '@/types/jlptAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function mapPaginatedResponse<T>(response: PaginatedResponse<T>): { items: T[]; meta: { total: number; page: number; pageSize: number } | null } {
  return {
    items: response.data ?? [],
    meta: response.metaData ?? null,
  }
}

export const jlptExamAdminService = {
  // ── Exam CRUD ──────────────────────────────────────────────────────────────

  async searchExams(query: SearchExamsQuery): Promise<ExamListResult> {
    const response = await api.get<PaginatedResponse<ExamListItemResponse>>('/exams', {
      params: omitNullishValues({
        keyword: query.keyword,
        level: query.level,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapPaginatedResponse(response.data)
  },

  async getExamDetail(id: string): Promise<ExamDetailResponse> {
    const response = await api.get<ApiResponse<ExamDetailResponse>>(`/exams/${id}`)
    if (!response.data.data) {
      throw new Error('Exam_NotFound_404')
    }
    return response.data.data
  },

  async createExam(payload: CreateExamPayload): Promise<ExamDetailResponse> {
    const response = await api.post<ApiResponse<ExamDetailResponse>>('/exams', payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateExam(id: string, payload: UpdateExamPayload): Promise<ExamDetailResponse> {
    const response = await api.put<ApiResponse<ExamDetailResponse>>(`/exams/${id}`, payload)
    if (!response.data.data) {
      throw new Error('Exam_NotFound_404')
    }
    return response.data.data
  },

  async publishExam(id: string): Promise<string> {
    const response = await api.patch<ApiResponse<string>>(`/exams/${id}/publish`)
    return response.data.data
  },

  async deleteExam(id: string): Promise<string> {
    const response = await api.delete<ApiResponse<string>>(`/exams/${id}`)
    return response.data.data
  },

  // ── Section CRUD ───────────────────────────────────────────────────────────

  async createSection(examId: string, payload: CreateSectionPayload): Promise<ExamSectionResponse> {
    const response = await api.post<ApiResponse<ExamSectionResponse>>(`/exams/${examId}/sections`, payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateSection(examId: string, sectionId: string, payload: UpdateSectionPayload): Promise<ExamSectionResponse> {
    const response = await api.put<ApiResponse<ExamSectionResponse>>(`/exams/${examId}/sections/${sectionId}`, payload)
    if (!response.data.data) {
      throw new Error('Exam_NotFound_404')
    }
    return response.data.data
  },

  async deleteSection(examId: string, sectionId: string): Promise<string> {
    const response = await api.delete<ApiResponse<string>>(`/exams/${examId}/sections/${sectionId}`)
    return response.data.data
  },

  // ── Question Group CRUD ────────────────────────────────────────────────────

  async createGroup(sectionId: string, payload: CreateQuestionGroupPayload): Promise<QuestionGroupResponse> {
    const response = await api.post<ApiResponse<QuestionGroupResponse>>(`/exams/sections/${sectionId}/groups`, payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateGroup(sectionId: string, groupId: string, payload: UpdateQuestionGroupPayload): Promise<QuestionGroupResponse> {
    const response = await api.put<ApiResponse<QuestionGroupResponse>>(`/exams/sections/${sectionId}/groups/${groupId}`, payload)
    if (!response.data.data) {
      throw new Error('Exam_GroupNotFound_404')
    }
    return response.data.data
  },

  async deleteGroup(sectionId: string, groupId: string): Promise<string> {
    const response = await api.delete<ApiResponse<string>>(`/exams/sections/${sectionId}/groups/${groupId}`)
    return response.data.data
  },

  async generateGroupAudio(groupId: string): Promise<QuestionGroupResponse> {
    const response = await api.post<ApiResponse<QuestionGroupResponse>>(`/exams/groups/${groupId}/generate-audio`)
    if (!response.data.data) {
      throw new Error('AiQuestion_NoAudioScript_400')
    }
    return response.data.data
  },
}
