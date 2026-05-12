import type { ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'

interface EmptyStateProps {
  icon: Icon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: IconComponent, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high">
        <IconComponent size={24} className="text-primary" />
      </div>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
