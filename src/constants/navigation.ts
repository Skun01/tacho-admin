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
  GraduationCapIcon,
  WarningCircleIcon,
  MicrophoneIcon,
  ExamIcon,
  RobotIcon,
  ClipboardTextIcon,
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
  { icon: MicrophoneIcon, label: 'Shadowing', href: '/admin/shadowing' },
  {
    icon: ClipboardTextIcon,
    label: 'JLPT',
    children: [
      { icon: ExamIcon, label: 'Đề thi', href: '/admin/jlpt/exams' },
      { icon: RobotIcon, label: 'Câu hỏi AI', href: '/admin/jlpt/ai-questions' },
    ],
  },
  { icon: CardsIcon, label: 'Bộ thẻ', href: '/admin/decks' },
  {
    icon: GraduationCapIcon,
    label: 'Học tập',
    children: [
      { icon: WarningCircleIcon, label: 'Vấn đề nội dung', href: '/admin/learning/issues' },
    ],
  },
  { icon: UsersIcon, label: 'Người dùng', href: '/admin/users' },
  { icon: GearIcon, label: 'Cài đặt', href: '/settings' },
]

export const ADMIN_NAV_EXTERNAL: NavItem = {
  icon: ArrowSquareOutIcon,
  label: 'Mở Web App',
  href: import.meta.env.VITE_WEBAPP_URL ?? 'http://localhost:5173',
  external: true,
}

/** Maps route segments (joined with '/') to human-readable breadcrumb labels. */
export const ADMIN_NAV_BREADCRUMB_MAP: Record<string, string> = {
  dashboard: 'Bảng điều khiển',
  'admin/vocabulary': 'Từ vựng',
  'admin/vocabulary/create': 'Tạo từ vựng',
  'admin/vocabulary/:id/edit': 'Sửa từ vựng',
  'admin/grammar': 'Ngữ pháp',
  'admin/grammar/create': 'Tạo ngữ pháp',
  'admin/grammar/:id/edit': 'Sửa ngữ pháp',
  'admin/kanji': 'Hán tự',
  'admin/sentences': 'Câu ví dụ',
  'admin/decks': 'Bộ thẻ',
  'admin/decks/create': 'Tạo bộ thẻ',
  'admin/decks/:id/edit': 'Sửa bộ thẻ',
  'admin/deck-types': 'Loại bộ thẻ',
  'admin/learning/issues': 'Vấn đề nội dung',
  'admin/decks/:id/coverage': 'Phạm vi bộ thẻ',
  'admin/shadowing': 'Shadowing',
  'admin/shadowing/:id': 'Chủ đề Shadowing',
  'admin/jlpt/exams': 'Đề thi JLPT',
  'admin/jlpt/exams/:id': 'Chi tiết đề thi',
  'admin/jlpt/ai-questions': 'Câu hỏi AI',
  'admin/users': 'Người dùng',
}
