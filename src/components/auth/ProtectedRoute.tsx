import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'

/**
 * ProtectedRoute — yêu cầu đăng nhập VÀ role editor/admin.
 * Gỡ bỏ infinite loop bằng cách hiển thị message Forbidden thay vì redirect về /login nếu role là 'user' nhưng có token.
 */
export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const logout = useAuthStore((s) => s.logout)

  if (isLoading) return null

  if (!token) return <Navigate to="/login" replace />

  // Role guard: chỉ editor hoặc admin
  if (user?.role === 'user') {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 bg-background">
        <h1 className="text-3xl font-bold mb-4">Truy cập bị từ chối</h1>
        <p className="max-w-md text-center text-muted-foreground mb-6">
          Tài khoản của bạn không có quyền truy cập vào khu vực quản trị. Vui lòng sử dụng tài khoản admin/editor.
        </p>
        <Button onClick={() => {
            logout()
            window.location.href = '/login'
        }}>
          Đăng nhập bằng tài khoản khác
        </Button>
      </div>
    )
  }

  return <Outlet />
}
