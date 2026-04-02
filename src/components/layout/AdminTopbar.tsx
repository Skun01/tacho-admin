import { ListIcon } from '@phosphor-icons/react'
import { useSidebarStore } from '@/stores/sidebarStore'

interface AdminTopbarProps {
  title?: string
}

export function AdminTopbar({ title }: AdminTopbarProps) {
  const toggle = useSidebarStore((s) => s.toggle)
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

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

      {/* Page title */}
      {title && (
        <h1
          className="font-heading-vn text-base font-semibold"
          style={{ color: 'var(--on-surface)' }}
        >
          {title}
        </h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right slot — placeholder cho breadcrumb/search sau */}
      <div
        className="hidden md:flex items-center text-xs"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {isCollapsed ? null : null}
      </div>
    </header>
  )
}
