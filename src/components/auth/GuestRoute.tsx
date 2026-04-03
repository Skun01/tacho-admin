import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export function GuestRoute() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null

  // Chặn redirect tự động vào dashboard nếu chỉ là user thường
  const shouldRedirect = token && user && user.role !== 'user'

  return shouldRedirect ? <Navigate to="/dashboard" replace /> : <Outlet />
}
