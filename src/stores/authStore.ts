import { create } from 'zustand'
import type { UserDTO } from '@/types/auth'

interface AuthState {
  token: string | null
  user: UserDTO | null
  isLoading: boolean
  login: (token: string, user: UserDTO) => void
  logout: () => void
  setUser: (user: UserDTO) => void
  init: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  login: (token, user) => set({ token, user, isLoading: false }),

  logout: () => set({ token: null, user: null, isLoading: false }),

  setUser: (user) => set({ user }),

  init: async () => {
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      // Refresh lấy token mới + user (AuthDTO)
      const { data: refreshRes } = await authService.refresh()
      if (refreshRes.success) {
        const { accessToken } = refreshRes.data
        // Lấy user info mới nhất từ /me
        const { data: meRes } = await authService.me()
        if (meRes.success) {
          set({ token: accessToken, user: meRes.data, isLoading: false })
          return
        }
      }
      set({ token: null, user: null, isLoading: false })
    } catch {
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
