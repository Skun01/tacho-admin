import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { AdminUser, AdminUserDetail, UpdateUserRoleDTO, BanUserDTO } from '@/types/user'
import api from './api'

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export const userService = {
  list: (params?: UserListParams) =>
    api.get<PaginatedResponse<AdminUser>>('/admin/users', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<AdminUserDetail>>(`/admin/users/${id}`),

  updateRole: (id: string, dto: UpdateUserRoleDTO) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, dto),

  setBan: (id: string, dto: BanUserDTO) =>
    api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/ban`, dto),
}
