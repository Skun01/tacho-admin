import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { ContentSummaryResponse, UserSummaryResponse } from '@/types/dashboardAdmin'

export const dashboardAdminService = {
  async getContentSummary(): Promise<ContentSummaryResponse> {
    const response = await api.get<ApiResponse<ContentSummaryResponse>>(
      '/admin/dashboard/content/summary',
    )
    if (!response.data.data) throw new Error('Common_500')
    return response.data.data
  },

  async getUserSummary(): Promise<UserSummaryResponse> {
    const response = await api.get<ApiResponse<UserSummaryResponse>>(
      '/admin/dashboard/users/summary',
    )
    if (!response.data.data) throw new Error('Common_500')
    return response.data.data
  },
}
