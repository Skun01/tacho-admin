import type { UserRole } from '@/types/auth'

export interface NavItem {
  label: string
  path: string
  icon: string
  requiredRole?: UserRole
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'SquaresFour' },
    ],
  },
  {
    label: 'Nội dung',
    items: [
      { label: 'Thẻ', path: '/cards', icon: 'Cards' },
      { label: 'Bộ thẻ', path: '/decks', icon: 'Stack' },
    ],
  },
  {
    label: 'Cộng đồng',
    items: [
      { label: 'Bình luận', path: '/comments', icon: 'ChatTeardropText' },
      { label: 'Thông báo', path: '/notifications/system', icon: 'Bell' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { label: 'Người dùng', path: '/users', icon: 'Users', requiredRole: 'admin' },
    ],
  },
]

export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Người dùng',
  editor: 'Biên tập viên',
  admin: 'Quản trị viên',
}
