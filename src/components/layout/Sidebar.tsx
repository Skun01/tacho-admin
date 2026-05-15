import { Link } from 'react-router'
import { ArrowLineLeftIcon, ArrowLineRightIcon, XIcon } from '@phosphor-icons/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarNavGroup } from './SidebarNavGroup'
import { SidebarUserFooter } from './SidebarUserFooter'
import { useSidebarStore } from '@/stores/sidebarStore'
import { ADMIN_NAV_ITEMS, ADMIN_NAV_EXTERNAL } from '@/constants/navigation'

export function Sidebar() {
  const { isOpen, isCollapsed, close, toggleCollapsed } = useSidebarStore()

  return (
    <TooltipProvider>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen flex flex-col
          transition-all duration-300 ease-in-out
          bg-sidebar-bg backdrop-blur-[12px]
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top: Logo + collapse/close button */}
        <div
          className={`flex items-center pt-12 pb-6 px-4 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="/torii.svg"
                alt="Tacho"
                className="w-7 h-7 object-contain brightness-0 invert"
              />
              <span className="font-bold text-base tracking-wide text-on-primary">
                Tacho
              </span>
            </Link>
          )}

          {/* Desktop: collapse toggle */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded transition-colors hover:brightness-110 text-sidebar-icon-muted"
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isCollapsed
              ? <ArrowLineRightIcon size={16} />
              : <ArrowLineLeftIcon size={16} />
            }
          </button>

          {/* Mobile: close button */}
          <button
            onClick={close}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded text-sidebar-icon-muted"
            aria-label="Đóng menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/*Nav items*/}
        <ScrollArea className="flex-1 min-h-0 px-2">
          <nav className="space-y-1 pb-2">
            {ADMIN_NAV_ITEMS.map((item) => (
              'children' in item ? (
                <SidebarNavGroup
                  key={item.label}
                  item={item}
                  isCollapsed={isCollapsed}
                  onClick={close}
                />
              ) : (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
                  onClick={close}
                />
              )
            ))}

            {/* Tonal separator trước external link */}
            <div className="my-2 h-px mx-3 bg-sidebar-separator" />

            <SidebarNavItem
              item={ADMIN_NAV_EXTERNAL}
              isCollapsed={isCollapsed}
            />
          </nav>
        </ScrollArea>

        {/*User footer*/}
        <div className="mt-auto shrink-0 px-2 pb-6">
          <SidebarUserFooter isCollapsed={isCollapsed} />
        </div>
      </aside>
    </TooltipProvider>
  )
}
