import { NavLink } from 'react-router'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { NavItem } from '@/constants/navigation'

interface SidebarNavItemProps {
  item: NavItem
  isCollapsed: boolean
  onClick?: () => void
}

export function SidebarNavItem({ item, isCollapsed, onClick }: SidebarNavItemProps) {
  const { icon: Icon, label, href, external } = item

  const content = (
    <span
      className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150 ${
        isCollapsed ? 'justify-center' : ''
      }`}
    >
      <Icon size={20} weight="regular" className="shrink-0" />
      {!isCollapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </span>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md text-sidebar-nav-text hover:brightness-110 transition-all"
        title={isCollapsed ? label : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  const link = (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `block rounded-md hover:brightness-110 transition-all ${
          isActive
            ? 'bg-sidebar-nav-active-bg text-sidebar-nav-text-active shadow-[inset_4px_0_0_var(--primary)]'
            : 'text-sidebar-nav-text'
        }`
      }
      onClick={onClick}
    >
      {content}
    </NavLink>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block">{link}</span>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
}
