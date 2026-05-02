// Shared types
export type AdminUserRole = 'user' | 'editor' | 'admin'

export const ADMIN_USER_ROLE_OPTIONS: AdminUserRole[] = ['user', 'editor', 'admin']

export const ADMIN_USER_ROLE_LABELS: Record<AdminUserRole, string> = {
  user: 'Người dùng',
  editor: 'Biên tập viên',
  admin: 'Quản trị viên',
}

export const ADMIN_USER_STATUS_LABELS: Record<string, string> = {
  true: 'Hoạt động',
  false: 'Bị khóa',
}

// ── API DTOs ───────────────────────────────────────────────────────────────────

export interface AdminUserListItem {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  role: AdminUserRole
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string | null
}

export interface AdminUserDetail {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  role: AdminUserRole
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string | null
}

// API shapes are identical; reuse for list and detail
export type AdminUserResponse = AdminUserListItem

// ── Query params ──────────────────────────────────────────────────────────────

export interface AdminUserSearchQuery {
  q?: string
  role?: AdminUserRole
  isActive?: boolean
  isVerified?: boolean
  page?: number
  pageSize?: number
}

// ── Mutation payloads ─────────────────────────────────────────────────────────

export interface AdminUserChangeRolePayload {
  role: AdminUserRole
}

export interface AdminUserChangeStatusPayload {
  isActive: boolean
}

export interface AdminUserChangeVerificationPayload {
  isVerified: boolean
}

// ── Label helpers ──────────────────────────────────────────────────────────────

export function getAdminUserRoleLabel(role: AdminUserRole): string {
  return ADMIN_USER_ROLE_LABELS[role] ?? role
}

export function getAdminUserStatusLabel(isActive: boolean): string {
  return ADMIN_USER_STATUS_LABELS[String(isActive)] ?? (isActive ? 'Hoạt động' : 'Bị khóa')
}