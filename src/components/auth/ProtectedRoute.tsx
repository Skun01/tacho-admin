import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

/**
 * ProtectedRoute — yêu cầu đăng nhập VÀ role editor/admin.
 * Role 'user' bị redirect về /login (không có quyền vào admin).
 */
export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null

  if (!token) return <Navigate to="/login" replace />

  // Role guard: chỉ editor hoặc admin
  if (user?.role === 'user') return <Navigate to="/login" replace />

  return <Outlet />
}
