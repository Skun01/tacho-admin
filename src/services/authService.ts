import type { ApiResponse } from '@/types/api'
import type {
  AuthDTO,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserDTO,
} from '@/types/auth'
import api from './api'

export const authService = {
  login: (payload: LoginRequest) =>
    api.post<ApiResponse<AuthDTO>>('/auth/login', payload),

  refresh: () =>
    api.post<ApiResponse<AuthDTO>>('/auth/refresh'),

  me: () =>
    api.get<ApiResponse<UserDTO>>('/auth/me'),

  logout: () =>
    api.post<ApiResponse<boolean>>('/auth/logout'),

  updateProfile: (payload: UpdateProfileRequest) =>
    api.patch<ApiResponse<UserDTO>>('/auth/me/profile', payload),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<ApiResponse<UserDTO>>('/auth/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  changePassword: (payload: ChangePasswordRequest) =>
    api.patch<ApiResponse<boolean>>('/auth/change-password', payload),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    api.post<ApiResponse<boolean>>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordRequest) =>
    api.post<ApiResponse<boolean>>('/auth/reset-password', payload),
}
