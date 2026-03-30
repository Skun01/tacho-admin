import { Link } from 'react-router'
import { LockKey } from '@phosphor-icons/react'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary-container">
        <LockKey size={32} weight="duotone" className="text-tertiary" />
      </div>
      <div className="text-center">
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-700 tracking-tight text-on-surface">
          Không có quyền truy cập
        </h1>
        <p className="mt-2 text-sm text-outline">
          Tài khoản của bạn không có quyền vào trang quản trị.
        </p>
      </div>
      <Link
        to="/login"
        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Về trang đăng nhập
      </Link>
    </div>
  )
}
