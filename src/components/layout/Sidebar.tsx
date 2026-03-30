import { NavLink } from 'react-router'
import {
  SquaresFour,
  Cards,
  Stack,
  ChatTeardropText,
  Bell,
  Users,
} from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/authStore'
import { NAV_GROUPS, ROLE_LABELS } from '@/constants/navigation'
import type { UserRole } from '@/types/auth'

const ICON_MAP: Record<string, React.ElementType> = {
  SquaresFour,
  Cards,
  Stack,
  ChatTeardropText,
  Bell,
  Users,
}

const ROLE_RANK: Record<UserRole, number> = { user: 0, editor: 1, admin: 2 }

export function Sidebar() {
  const user = useAuthStore((s) => s.user)

  const canAccess = (requiredRole?: UserRole) => {
    if (!requiredRole || !user) return !requiredRole
    return ROLE_RANK[user.role] >= ROLE_RANK[requiredRole]
  }

  return (
    <aside
      className="relative flex h-screen w-[208px] shrink-0 flex-col overflow-hidden bg-surface-container-low"
      style={{ padding: '24px 14px' }}
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -40,
          width: 220,
          height: 220,
          background: 'radial-gradient(ellipse, rgba(197,241,131,0.18) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: 20,
          left: -20,
          width: 180,
          height: 140,
          background: 'radial-gradient(ellipse, rgba(151,222,252,0.15) 0%, transparent 65%)',
        }}
      />

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-3">
        <span
          className="text-xl font-medium text-primary"
          style={{ fontFamily: "'Kiwi Maru', serif" }}
        >
          太
        </span>
        <span
          className="text-base font-semibold tracking-wide text-on-surface"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Tacho
        </span>
        <span className="ml-auto rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-semibold text-on-primary-container">
          Admin
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => canAccess(item.requiredRole))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="flex flex-col gap-1">
              <p
                className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-outline-variant"
              >
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const Icon = ICON_MAP[item.icon]
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                        isActive
                          ? 'bg-[#e8f7d0] text-primary'
                          : 'text-outline hover:bg-surface-container-high',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {Icon && (
                          <Icon
                            size={16}
                            weight={isActive ? 'fill' : 'regular'}
                            className="shrink-0"
                          />
                        )}
                        {item.label}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div className="mt-6 rounded-lg bg-surface-container-lowest px-3 py-2.5">
          <p className="truncate text-[13px] font-medium text-on-surface">{user.displayName}</p>
          <p className="mt-0.5 text-[11px] text-outline">{ROLE_LABELS[user.role]}</p>
        </div>
      )}
    </aside>
  )
}
