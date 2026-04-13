import type { Icon } from '@phosphor-icons/react'
import {
  HouseSimpleIcon,
  FolderNotchOpenIcon,
  BookOpenTextIcon,
  TextTIcon,
  OnigiriIcon,
  BracketsAngleIcon,
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

export interface NavGroup {
  icon: Icon
  label: string
  children: NavItem[]
}

export type AdminNavEntry = NavItem | NavGroup

export const ADMIN_NAV_ITEMS: AdminNavEntry[] = [
  { icon: HouseSimpleIcon, label: 'Bảng điều khiển', href: '/dashboard' },
  {
    icon: FolderNotchOpenIcon,
    label: 'Quản lý nội dung',
    children: [
      { icon: BookOpenTextIcon, label: 'Từ vựng', href: '/admin/vocabulary' },
      { icon: BracketsAngleIcon, label: 'Ngữ pháp', href: '/admin/grammar' },
      { icon: OnigiriIcon, label: 'Hán tự', href: '/admin/kanji' },
      { icon: TextTIcon, label: 'Câu ví dụ', href: '/admin/sentences' },
    ],
  },
  { icon: CardsIcon, label: 'Bộ thẻ', href: '/decks' },
  { icon: UsersIcon, label: 'Người dùng', href: '/users' },
  { icon: GearIcon, label: 'Cài đặt', href: '/settings' },
]

export const ADMIN_NAV_EXTERNAL: NavItem = {
  icon: ArrowSquareOutIcon,
  label: 'Mở Web App',
  href: import.meta.env.VITE_WEBAPP_URL ?? 'http://localhost:5173',
  external: true,
}
