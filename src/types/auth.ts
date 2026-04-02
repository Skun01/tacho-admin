export type UserRole = 'user' | 'editor' | 'admin'

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateProfileRequest {
  displayName: string
  avatarUrl?: string | null
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface UserDTO {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
}

export interface AuthDTO {
  accessToken: string
  user: UserDTO
}
