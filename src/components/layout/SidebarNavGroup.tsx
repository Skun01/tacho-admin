import { useState } from 'react'
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SidebarNavItem } from './SidebarNavItem'
import type { NavGroup } from '@/constants/navigation'

interface SidebarNavGroupProps {
  item: NavGroup
  isCollapsed: boolean
  onClick?: () => void
}

export function SidebarNavGroup({ item, isCollapsed, onClick }: SidebarNavGroupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { icon: Icon, label, children } = item

  const parentButton = (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150 hover:brightness-110 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}
      style={{ color: 'var(--sidebar-nav-text)' }}
      aria-label={label}
      aria-expanded={isOpen}
    >
      <span className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <Icon size={20} weight="regular" className="shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </span>
      {!isCollapsed && (isOpen ? <CaretDownIcon size={16} /> : <CaretRightIcon size={16} />)}
    </button>
  )

  return (
    <div className="space-y-1">
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block">{parentButton}</span>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      ) : (
        parentButton
      )}

      {!isCollapsed && isOpen && (
        <div className="space-y-1 pl-4">
          {children.map((child) => (
            <SidebarNavItem key={child.href} item={child} isCollapsed={false} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  )
}
