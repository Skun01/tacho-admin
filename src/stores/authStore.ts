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
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      const { data } = await authService.refresh()
      set({
        token: data.data.accessToken,
        isLoading: false,
      })
    } catch {
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
