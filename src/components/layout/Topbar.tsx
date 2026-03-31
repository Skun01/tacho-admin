import { useNavigate } from 'react-router'
import { SignOut, ArrowLeft } from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { ROLE_LABELS } from '@/constants/navigation'
import { gooeyToast } from '@/components/ui/goey-toaster'

const ROLE_CHIP: Record<string, { bg: string; text: string }> = {
  admin:  { bg: 'bg-primary-container',   text: 'text-on-primary-container' },
  editor: { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  user:   { bg: 'bg-muted',               text: 'text-outline' },
}

interface TopbarProps {
  title?: string
  backPath?: string
  backLabel?: string
}

export function Topbar({ title, backPath, backLabel }: TopbarProps) {
  const user    = useAuthStore((s) => s.user)
  const logout  = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // ignore — clear locally regardless
    }
    logout()
    navigate('/login', { replace: true })
    gooeyToast.success('Đã đăng xuất')
  }

  const chip = user ? (ROLE_CHIP[user.role] ?? ROLE_CHIP.user) : null

  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-surface px-6">
      <div className="flex items-center gap-3">
        {backPath && (
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <ArrowLeft size={13} weight="bold" />
            {backLabel ?? 'Quay lại'}
          </button>
        )}
        {backPath && title && (
          <span className="text-outline/40 text-[13px]">/</span>
        )}
        {title && (
          <h1
            className="text-[15px] font-semibold text-on-surface"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h1>
        )}
      </div>
      {!title && !backPath && <div />}

      <div className="flex items-center gap-3">
        {user && chip && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${chip.bg} ${chip.text}`}
          >
            {ROLE_LABELS[user.role]}
          </span>
        )}
        {user && (
          <span className="text-[13px] font-medium text-on-surface-variant">
            {user.displayName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-low hover:text-tertiary"
          title="Đăng xuất"
        >
          <SignOut size={18} weight="regular" />
        </button>
      </div>
    </header>
  )
}
