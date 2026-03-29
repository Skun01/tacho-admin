import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'

export function GuestRoute() {
  const token = useAuthStore((s) => s.token)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return null

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />
}
