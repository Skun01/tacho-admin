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

  const activeStyle = {
    boxShadow: 'inset 4px 0 0 var(--primary)',
    backgroundColor: 'var(--sidebar-nav-active-bg)',
    color: 'var(--sidebar-nav-text-active)',
  }

  const baseStyle = {
    color: 'var(--sidebar-nav-text)',
    display: 'block',
    borderRadius: '0.375rem',
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={baseStyle}
        className="hover:brightness-110 transition-all"
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
      style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
      className="hover:brightness-110 transition-all"
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
