import { useQuery } from '@tanstack/react-query'
import { adminUserService } from '@/services/adminUserService'
import type { AdminUserSearchQuery } from '@/types/adminUser'

export function useAdminUserList(query: AdminUserSearchQuery) {
  return useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: async () => {
      const { data } = await adminUserService.search(query)
      return data
    },
  })
}

export function useAdminUserDetail(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await adminUserService.getById(id)
      return data
    },
    enabled: Boolean(id),
  })
}