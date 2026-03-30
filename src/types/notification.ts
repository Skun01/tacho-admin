export type NotifType = 'system' | 'achievement' | 'reminder' | 'social'
export type NotifTargetScope = 'all' | 'role' | 'user'

export interface SystemNotif {
  id: string
  title: string
  body: string
  type: NotifType
  targetScope: NotifTargetScope
  targetRole?: string
  targetUserId?: string
  isRead: boolean
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}

export interface CreateSystemNotifDTO {
  title: string
  body: string
  type: NotifType
  targetScope: NotifTargetScope
  targetRole?: string
  targetUserId?: string
  scheduledAt?: string
}
