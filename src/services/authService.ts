import type { ApiResponse } from '@/types/api'
import type { AuthDTO, LoginRequest, RegisterRequest, UserDTO } from '@/types/auth'
import api from './api'

type ApiResult<T> = Promise<{ data: ApiResponse<T> }>

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<{ data: ApiResponse<T> }> {
  const response = await request
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'INTERNAL_SERVER_ERROR')
  }
  return response
}

export const authService = {
  login: (payload: LoginRequest) =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/login', payload) as ApiResult<AuthDTO>),

  register: (payload: RegisterRequest) =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/register', payload) as ApiResult<AuthDTO>),

  refresh: () =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/refresh-token') as ApiResult<AuthDTO>),

  logout: () =>
    unwrap(api.post<ApiResponse<null>>('/auth/logout') as ApiResult<null>),

  getMe: () =>
    unwrap(api.get<ApiResponse<UserDTO>>('/auth/me') as ApiResult<UserDTO>),
}
