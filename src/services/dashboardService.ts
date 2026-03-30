import type { ApiResponse } from '@/types/api'
import type { AdminDashboard } from '@/types/dashboard'
import api from './api'

export const dashboardService = {
  getDashboard: () =>
    api.get<ApiResponse<AdminDashboard>>('/admin/dashboard'),
}
