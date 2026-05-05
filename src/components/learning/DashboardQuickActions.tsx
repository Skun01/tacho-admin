import { useNavigate } from 'react-router'
import {
  BookOpenTextIcon,
  BracketsAngleIcon,
  CardsIcon,
  ExamIcon,
  MicrophoneIcon,
  OnigiriIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'

const C = ADMIN_LEARNING_CONTENT.overview

interface QuickAction {
  icon: React.ElementType
  label: string
  href: string
  description: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: BookOpenTextIcon,
    label: C.quickAddVocabulary,
    href: '/admin/vocabulary/create',
    description: 'Thêm từ mới',
  },
  {
    icon: BracketsAngleIcon,
    label: C.quickAddGrammar,
    href: '/admin/grammar/create',
    description: 'Thêm ngữ pháp',
  },
  {
    icon: OnigiriIcon,
    label: C.quickAddKanji,
    href: '/admin/kanji',
    description: 'Quản lý Hán tự',
  },
  {
    icon: CardsIcon,
    label: C.quickManageDecks,
    href: '/admin/decks',
    description: 'Tổ chức bộ thẻ',
  },
  {
    icon: ExamIcon,
    label: C.quickViewJlptExams,
    href: '/admin/jlpt/exams',
    description: 'Xem đề thi',
  },
  {
    icon: MicrophoneIcon,
    label: C.quickViewShadowing,
    href: '/admin/shadowing',
    description: 'Nội dung shadowing',
  },
  {
    icon: WarningCircleIcon,
    label: C.quickViewIssues,
    href: '/admin/learning/issues',
    description: 'Vấn đề cấu hình',
  },
]

export function DashboardQuickActions() {
  const navigate = useNavigate()

  return (
    <section aria-labelledby="quick-actions-title">
      <h3
        id="quick-actions-title"
        className="mb-4 text-sm font-semibold uppercase tracking-wider"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {C.quickActionsTitle}
      </h3>

      <div className="space-y-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.href}
            type="button"
            className="
              w-full flex items-center gap-4 p-4 rounded-lg
              transition-colors text-left
              hover:brightness-105 active:brightness-95
            "
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
            onClick={() => navigate(action.href)}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--surface-container-high)' }}
            >
              <action.icon
                size={18}
                style={{ color: 'var(--primary)' }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--on-surface)' }}
              >
                {action.label}
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}