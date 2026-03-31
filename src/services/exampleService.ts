import api from './api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Example, CreateExampleDTO } from '@/types/example'

export const exampleService = {
  list: (params?: { q?: string; jlptLevel?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Example>>('/admin/examples', { params }),

  get: (id: string) =>
    api.get<ApiResponse<Example>>(`/admin/examples/${id}`),

  create: (payload: CreateExampleDTO) =>
    api.post<ApiResponse<Example>>('/admin/examples', payload),

  update: (id: string, payload: Partial<CreateExampleDTO>) =>
    api.patch<ApiResponse<Example>>(`/admin/examples/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/admin/examples/${id}`),
}
