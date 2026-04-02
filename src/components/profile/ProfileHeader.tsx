import { Link } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'

/**
 * ProfileHeader — hiển thị avatar, tên, role và nút quay lại dashboard.
 * Đặt trong components/profile/ vì gắn với domain profile, không phải layout chung.
 */
export function ProfileHeader() {
  const user = useAuthStore((s) => s.user)

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD'

  const roleLabel: Record<string, string> = {
    admin: 'Quản trị viên',
    editor: 'Biên tập viên',
    user: 'Người dùng',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-sm w-fit transition-opacity hover:opacity-70"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        <ArrowLeftIcon size={16} />
        Quay lại Dashboard
      </Link>

      {/* Avatar + info */}
      <div className="flex items-center gap-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
          <AvatarFallback
            className="text-lg font-semibold"
            style={{
              backgroundColor: 'var(--secondary-container)',
              color: 'var(--on-secondary-container)',
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1
            className="font-heading-vn text-xl font-bold"
            style={{ color: 'var(--on-surface)' }}
          >
            {user?.displayName ?? '—'}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="text-sm"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {user?.email}
            </span>
            {user?.role && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                {roleLabel[user.role] ?? user.role}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
