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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'

const C = ADMIN_LEARNING_CONTENT.overview

interface QuickAction {
  icon: React.ElementType
  label: string
  href: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: BookOpenTextIcon, label: C.quickAddVocabulary, href: '/admin/vocabulary/create' },
  { icon: BracketsAngleIcon, label: C.quickAddGrammar, href: '/admin/grammar/create' },
  { icon: OnigiriIcon, label: C.quickAddKanji, href: '/admin/kanji' },
  { icon: CardsIcon, label: C.quickManageDecks, href: '/admin/decks' },
  { icon: ExamIcon, label: C.quickViewJlptExams, href: '/admin/jlpt/exams' },
  { icon: MicrophoneIcon, label: C.quickViewShadowing, href: '/admin/shadowing' },
  { icon: WarningCircleIcon, label: C.quickViewIssues, href: '/admin/learning/issues' },
]

export function DashboardQuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-0 px-6">
        <CardTitle className="text-sm font-semibold">{C.quickActionsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.href}
              type="button"
              variant="outline"
              className="justify-start h-auto py-3 px-3 text-sm"
              onClick={() => navigate(action.href)}
            >
              <action.icon size={16} className="shrink-0 mr-2" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}