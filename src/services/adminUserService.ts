import type { ApiResponse } from '@/types/api'
import type {
  AdminUserChangeRolePayload,
  AdminUserChangeStatusPayload,
  AdminUserChangeVerificationPayload,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserSearchQuery,
} from '@/types/adminUser'
import api from './api'

export const adminUserService = {
  search: (query: AdminUserSearchQuery) =>
    api.get<ApiResponse<AdminUserListItem[]>>('/admin/users', { params: { ...query } }),

  getById: (id: string) =>
    api.get<ApiResponse<AdminUserDetail>>(`/admin/users/${id}`),

  changeRole: (id: string, payload: AdminUserChangeRolePayload) =>
    api.patch<ApiResponse<AdminUserDetail>>(`/admin/users/${id}/role`, payload),

  changeStatus: (id: string, payload: AdminUserChangeStatusPayload) =>
    api.patch<ApiResponse<AdminUserDetail>>(`/admin/users/${id}/status`, payload),

  changeVerification: (id: string, payload: AdminUserChangeVerificationPayload) =>
    api.patch<ApiResponse<AdminUserDetail>>(`/admin/users/${id}/verification`, payload),

  sendResetPassword: (id: string) =>
    api.post<ApiResponse<boolean>>(`/admin/users/${id}/send-reset-password`),
}