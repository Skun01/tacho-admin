import { useQuery } from '@tanstack/react-query'
import { dashboardAdminService } from '@/services/dashboardAdminService'

const FIVE_MINUTES = 1000 * 60 * 5

export const DASHBOARD_ADMIN_QUERY_KEYS = {
  all: ['admin', 'dashboard'] as const,
  contentSummary: () => [...DASHBOARD_ADMIN_QUERY_KEYS.all, 'content-summary'] as const,
  userSummary: () => [...DASHBOARD_ADMIN_QUERY_KEYS.all, 'user-summary'] as const,
}

export function useContentSummary() {
  return useQuery({
    queryKey: DASHBOARD_ADMIN_QUERY_KEYS.contentSummary(),
    queryFn: () => dashboardAdminService.getContentSummary(),
    staleTime: FIVE_MINUTES,
  })
}

export function useUserSummary() {
  return useQuery({
    queryKey: DASHBOARD_ADMIN_QUERY_KEYS.userSummary(),
    queryFn: () => dashboardAdminService.getUserSummary(),
    staleTime: FIVE_MINUTES,
  })
}
