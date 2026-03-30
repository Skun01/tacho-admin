import { create } from 'zustand'
import type { UserDTO } from '@/types/auth'

interface AuthState {
  token: string | null
  user: UserDTO | null
  isLoading: boolean
  setToken: (token: string) => void
  login: (token: string, user: UserDTO) => void
  logout: () => void
  init: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setToken: (token) => set({ token }),

  login: (token, user) => set({ token, user, isLoading: false }),

  logout: () => set({ token: null, user: null, isLoading: false }),

  init: async () => {
    if (import.meta.env.DEV) {
      set({
        token: 'dev-mock-token',
        user: {
          id: 'dev-user-id',
          email: 'admin@tacho.dev',
          displayName: 'Admin Dev',
          avatarUrl: undefined,
          createdAt: new Date().toISOString(),
          role: 'admin',
        },
        isLoading: false,
      })
      return
    }
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      const refreshRes = await authService.refresh()
      const token = refreshRes.data.data.accessToken
      const meRes = await authService.getMe()
      set({
        token,
        user: meRes.data.data,
        isLoading: false,
      })
    } catch {
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
