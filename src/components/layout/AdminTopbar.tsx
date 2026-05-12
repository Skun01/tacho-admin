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

  // Fallback: capitalize last path segment when no map entry exists
  const fallbackLabel = segments.length > 0
    ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
    : null
  const displayCrumb = crumb ?? fallbackLabel

  return (
    <header className="h-14 flex items-center gap-4 px-6 lg:px-8 shrink-0 bg-surface-container-low">
      {/* Mobile hamburger */}
      <button
        onClick={toggle}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded transition-colors text-on-surface-variant"
        aria-label="Mở menu"
      >
        <ListIcon size={20} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Breadcrumb — inferred from current route */}
      {displayCrumb && (
        <nav aria-label="breadcrumb">
          <span className="text-xs font-medium text-on-surface-variant">
            {displayCrumb}
          </span>
        </nav>
      )}
    </header>
  )
}
