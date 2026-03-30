export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'deleted'

export interface Comment {
  id: string
  userId: string
  userDisplayName: string
  userAvatarUrl?: string
  cardId: string
  cardContent: string
  body: string
  status: CommentStatus
  createdAt: string
  parentId?: string
}
