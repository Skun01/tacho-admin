import type { ApiResponse } from '@/types/api'
import type { AuthDTO, LoginRequest, RegisterRequest, UserDTO } from '@/types/auth'
import api from './api'

export const authService = {
  login: (payload: LoginRequest) =>
    api.post<ApiResponse<AuthDTO>>('/auth/login', payload),

  register: (payload: RegisterRequest) =>
    api.post<ApiResponse<AuthDTO>>('/auth/register', payload),

  refresh: () =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),

  getMe: () =>
    api.get<ApiResponse<UserDTO>>('/auth/me'),
}
