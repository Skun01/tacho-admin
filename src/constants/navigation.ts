import type { Icon } from '@phosphor-icons/react'
import {
  HouseSimpleIcon,
  CardsIcon,
  UsersIcon,
  GearIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react'

export interface NavItem {
  icon: Icon
  label: string
  href: string
  external?: boolean
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { icon: HouseSimpleIcon, label: 'Dashboard',    href: '/dashboard' },
  { icon: CardsIcon,       label: 'Bộ thẻ',       href: '/decks' },
  { icon: UsersIcon,       label: 'Người dùng',   href: '/users' },
  { icon: GearIcon,        label: 'Cài đặt',      href: '/settings' },
]

export const ADMIN_NAV_EXTERNAL: NavItem = {
  icon: ArrowSquareOutIcon,
  label: 'Mở Web App',
  href: import.meta.env.VITE_WEBAPP_URL ?? 'http://localhost:5173',
  external: true,
}
