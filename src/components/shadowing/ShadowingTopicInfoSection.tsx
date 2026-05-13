import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  SHADOWING_ADMIN_CONTENT,
  SHADOWING_LEVEL_LABELS,
  SHADOWING_STATUS_LABELS,
  SHADOWING_VISIBILITY_LABELS,
} from '@/constants/shadowingAdmin'
import type { ShadowingTopicDetailResponse } from '@/types/shadowingAdmin'

interface ShadowingTopicInfoSectionProps {
  topic: ShadowingTopicDetailResponse
}

const INFO_GRID_FIELDS = [
  {
    key: 'level',
    label: SHADOWING_ADMIN_CONTENT.columns.level,
    render: (topic: ShadowingTopicDetailResponse) =>
      topic.level ? <Badge variant="outline">{SHADOWING_LEVEL_LABELS[topic.level]}</Badge> : SHADOWING_ADMIN_CONTENT.noneSymbol,
  },
  {
    key: 'status',
    label: SHADOWING_ADMIN_CONTENT.columns.status,
    render: (topic: ShadowingTopicDetailResponse) => (
      <Badge variant={topic.status === 'Published' ? 'success' : topic.status === 'Draft' ? 'warning' : 'outline'}>
        {SHADOWING_STATUS_LABELS[topic.status]}
      </Badge>
    ),
  },
  {
    key: 'visibility',
    label: SHADOWING_ADMIN_CONTENT.columns.visibility,
    render: (topic: ShadowingTopicDetailResponse) => (
      <Badge variant="outline">{SHADOWING_VISIBILITY_LABELS[topic.visibility]}</Badge>
    ),
  },
  {
    key: 'sentencesCount',
    label: SHADOWING_ADMIN_CONTENT.columns.sentencesCount,
    render: (topic: ShadowingTopicDetailResponse) => <p>{topic.sentencesCount}</p>,
  },
  {
    key: 'owner',
    label: SHADOWING_ADMIN_CONTENT.columns.owner,
    render: (topic: ShadowingTopicDetailResponse) => <p>{topic.creatorName}</p>,
  },
  {
    key: 'official',
    label: SHADOWING_ADMIN_CONTENT.topicInfoOfficialLabel,
    render: (topic: ShadowingTopicDetailResponse) => (
      <Badge variant={topic.isOfficial ? 'default' : 'outline'}>
        {topic.isOfficial
          ? SHADOWING_ADMIN_CONTENT.topicInfoOfficialBadgeLabel
          : SHADOWING_ADMIN_CONTENT.topicInfoRegularBadgeLabel}
      </Badge>
    ),
  },
  {
    key: 'updatedAt',
    label: SHADOWING_ADMIN_CONTENT.topicInfoUpdatedAtLabel,
    render: (topic: ShadowingTopicDetailResponse) => (
      <p>
        {topic.updatedAt
          ? new Date(topic.updatedAt).toLocaleDateString('vi-VN')
          : SHADOWING_ADMIN_CONTENT.noneSymbol}
      </p>
    ),
  },
] as const

export function ShadowingTopicInfoSection({ topic }: ShadowingTopicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{SHADOWING_ADMIN_CONTENT.topicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{SHADOWING_ADMIN_CONTENT.topicInfoDescriptionLabel}</p>
          <p className="whitespace-pre-line text-sm">
            {topic.description || SHADOWING_ADMIN_CONTENT.noneSymbol}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {INFO_GRID_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1 rounded-lg border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">{field.label}</p>
              <div className="text-sm font-medium">{field.render(topic)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
