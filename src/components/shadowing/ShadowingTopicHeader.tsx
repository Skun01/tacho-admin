import { ArrowLeftIcon, PencilIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SHADOWING_ADMIN_CONTENT } from '@/constants/shadowingAdmin'

interface ShadowingTopicHeaderProps {
  title: string
  description: string
  onBack: () => void
  onEdit: () => void
}

export function ShadowingTopicHeader({
  title,
  description,
  onBack,
  onEdit,
}: ShadowingTopicHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description || SHADOWING_ADMIN_CONTENT.noneSymbol}</p>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={onEdit}>
        <PencilIcon size={20} />
        {SHADOWING_ADMIN_CONTENT.actions.edit}
      </Button>
    </header>
  )
}
