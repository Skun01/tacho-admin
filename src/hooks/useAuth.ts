import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import type { ApiError } from '@/services/setupInterceptors'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  UpdateProfileFormPayload,
  UpdateProfileRequest,
} from '@/types/auth'
import { AUTH_ERROR_MESSAGES, AUTH_PROFILE_COPY } from '@/constants/auth'

// ── Error helper ──────────────────────────────────────────────────────────────
function getErrorMessage(error: unknown): string {
  const apiData = (error as ApiError)?.apiData
  const validationData = apiData?.data as Record<string, string[]> | undefined

  if (apiData?.code === 400 && validationData && typeof validationData === 'object') {
    const firstError = Object.values(validationData)
      .flat()
      .find((message) => Boolean(message))

    if (firstError && AUTH_ERROR_MESSAGES[firstError]) {
      return AUTH_ERROR_MESSAGES[firstError]
    }
  }

  if (apiData?.message && AUTH_ERROR_MESSAGES[apiData.message]) {
    return AUTH_ERROR_MESSAGES[apiData.message]
  }
  if (apiData?.code === 400) return AUTH_ERROR_MESSAGES['Validation_400']
  return AUTH_ERROR_MESSAGES.default
}

// ── useLogin — với role guard ─────────────────────────────────────────────────
export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: ({ data }) => {
      const { accessToken, user } = data.data
      // Role guard: chỉ editor hoặc admin mới được vào
      if (user.role === 'user') {
        gooeyToast.error('Tài khoản không có quyền truy cập hệ thống quản trị.')
        return
      }
      login(accessToken, user)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ── useLogout ─────────────────────────────────────────────────────────────────
export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      navigate('/login', { replace: true })
    },
    onError: () => {
      logout()
      navigate('/login', { replace: true })
    },
  })
}

// ── useForgotPassword ─────────────────────────────────────────────────────────
export function useForgotPassword(options?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.forgotPassword(payload),
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ── useResetPassword ──────────────────────────────────────────────────────────
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authService.resetPassword(payload),
    onSuccess: () => {
      gooeyToast.success('Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ── useChangePassword ─────────────────────────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      authService.changePassword(payload),
    onSuccess: () => {
      gooeyToast.success('Mật khẩu đã được thay đổi thành công.')
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ── useUpdateProfile ──────────────────────────────────────────────────────────
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async (payload: UpdateProfileFormPayload) => {
      let currentAvatarUrl: string | null | undefined = user?.avatarUrl ?? undefined;
      if (payload.removeAvatar) {
        currentAvatarUrl = null;
      }

      const profileResponse = await authService.updateProfile({
        displayName: payload.displayName,
        avatarUrl: currentAvatarUrl,
      } as UpdateProfileRequest)

      if (!payload.avatarFile) {
        return profileResponse
      }

      return await authService.uploadAvatar(payload.avatarFile)
    },
    onSuccess: ({ data }) => {
      setUser(data.data)
      gooeyToast.success(AUTH_PROFILE_COPY.saveProfileSuccess)
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}
