import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null

  return token ? <Outlet /> : <Navigate to="/login" replace />
}
