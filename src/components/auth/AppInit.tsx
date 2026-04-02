import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

/**
 * AppInit — chạy authStore.init() khi app load.
 * Hiển thị loading overlay trong khi kiểm tra refresh token.
 * Render children sau khi init xong.
 */
export function AppInit({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    init()
  }, [init])

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: 'var(--surface)' }}
        aria-label="Đang tải..."
      >
        {/* Minimal editorial loader — vòng tròn Crimson */}
        <div
          className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--primary-fixed-dim)',
          }}
        />
      </div>
    )
  }

  return <>{children}</>
}
