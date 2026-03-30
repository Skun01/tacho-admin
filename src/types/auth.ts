export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
}

export type UserRole = 'user' | 'editor' | 'admin'

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
