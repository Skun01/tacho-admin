import type { UserRole } from './auth'

export interface AdminUser {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  isBanned: boolean
  createdAt: string
  lastActiveAt?: string
}

export interface AdminUserDetail extends AdminUser {
  totalStudySessions: number
  totalCardsReviewed: number
  totalDecksOwned: number
  totalComments: number
}

export interface UpdateUserRoleDTO {
  role: UserRole
}

export interface BanUserDTO {
  banned: boolean
}
