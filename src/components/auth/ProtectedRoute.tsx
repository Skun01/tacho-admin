import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null
  if (!token) return <Navigate to="/login" replace />
  if (user?.role === 'user') return <Navigate to="/forbidden" replace />

  return <Outlet />
}
