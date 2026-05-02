import { ListIcon } from '@phosphor-icons/react'
import { useLocation } from 'react-router'
import { useSidebarStore } from '@/stores/sidebarStore'
import { ADMIN_NAV_BREADCRUMB_MAP } from '@/constants/navigation'

export function AdminTopbar() {
  const toggle = useSidebarStore((s) => s.toggle)
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  // e.g. /admin/vocabulary → ['admin', 'vocabulary']
  const crumb = ADMIN_NAV_BREADCRUMB_MAP[segments.join('/')] ?? null

  return (
    <header
      className="h-14 flex items-center gap-4 px-6 shrink-0"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={toggle}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded transition-colors"
        style={{ color: 'var(--on-surface-variant)' }}
        aria-label="Mở menu"
      >
        <ListIcon size={20} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Breadcrumb — inferred from current route */}
      {crumb && (
        <nav aria-label="breadcrumb">
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {crumb}
          </span>
        </nav>
      )}
    </header>
  )
}
