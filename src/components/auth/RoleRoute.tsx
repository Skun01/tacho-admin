import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/auth'

interface RoleRouteProps {
  requiredRole: UserRole
}

export function RoleRoute({ requiredRole }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null

  const ROLE_RANK: Record<UserRole, number> = { user: 0, editor: 1, admin: 2 }
  const hasAccess = user && ROLE_RANK[user.role] >= ROLE_RANK[requiredRole]

  return hasAccess ? <Outlet /> : <Navigate to="/forbidden" replace />
}
