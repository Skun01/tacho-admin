import { WarningIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LEARNING_ISSUE_TYPE_LABELS } from '@/types/learningAdmin'
import type { LearningAdminCardIssueItemResponse } from '@/types/learningAdmin'

interface IssuesBadgeProps {
  issues: LearningAdminCardIssueItemResponse[]
}

export function IssuesBadge({ issues }: IssuesBadgeProps) {
  if (issues.length === 0) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className="gap-1 text-xs cursor-help bg-red-600 text-white border-transparent">
            <WarningIcon size={14} />
            {issues.length}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <ul className="space-y-1 text-xs">
            {issues.map((issue, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="font-medium">{LEARNING_ISSUE_TYPE_LABELS[issue.type]}:</span>
                <span className="opacity-80">{issue.message}</span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
