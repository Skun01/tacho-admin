import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Comment, CommentStatus } from '@/types/comment'
import api from './api'

export interface CommentListParams {
  page?: number
  limit?: number
  status?: CommentStatus
  search?: string
}

export const commentService = {
  list: (params?: CommentListParams) =>
    api.get<PaginatedResponse<Comment>>('/admin/comments', { params }),

  approve: (id: string) =>
    api.patch<ApiResponse<null>>(`/admin/comments/${id}/approve`),

  reject: (id: string) =>
    api.patch<ApiResponse<null>>(`/admin/comments/${id}/reject`),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/comments/${id}`),
}
