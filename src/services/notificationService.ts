import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { SystemNotif, CreateSystemNotifDTO } from '@/types/notification'
import api from './api'

export const notificationService = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<SystemNotif>>('/admin/notifications', { params }),

  create: (dto: CreateSystemNotifDTO) =>
    api.post<ApiResponse<SystemNotif>>('/admin/notifications', dto),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/notifications/${id}`),
}
