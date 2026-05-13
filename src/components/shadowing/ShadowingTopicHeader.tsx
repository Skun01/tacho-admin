import { ArrowLeftIcon, ImageIcon, PencilIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SHADOWING_ADMIN_CONTENT, SHADOWING_STATUS_LABELS } from '@/constants/shadowingAdmin'
import { resolveApiMediaUrl } from '@/lib/mediaUrl'
import type { ShadowingStatus } from '@/types/shadowingAdmin'

interface ShadowingTopicHeaderProps {
  title: string
  description: string
  coverImageUrl: string | null
  status: ShadowingStatus
  onBack: () => void
  onEdit: () => void
}

const STATUS_VARIANT: Record<ShadowingStatus, 'success' | 'warning' | 'outline'> = {
  Published: 'success',
  Draft: 'warning',
  Archived: 'outline',
}

export function ShadowingTopicHeader({
  title,
  description,
  coverImageUrl,
  status,
  onBack,
  onEdit,
}: ShadowingTopicHeaderProps) {
  const resolvedCoverUrl = resolveApiMediaUrl(coverImageUrl)

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </Button>

        <div className="size-12 shrink-0 overflow-hidden rounded-md border bg-muted/50">
          {resolvedCoverUrl ? (
            <img
              src={resolvedCoverUrl}
              alt={title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon size={20} />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[status]}>
              {SHADOWING_STATUS_LABELS[status]}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {description || SHADOWING_ADMIN_CONTENT.noneSymbol}
            </p>
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" onClick={onEdit}>
        <PencilIcon size={20} />
        {SHADOWING_ADMIN_CONTENT.actions.edit}
      </Button>
    </header>
  )
}
