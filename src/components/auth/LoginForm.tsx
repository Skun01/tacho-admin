import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { Warning } from '@phosphor-icons/react'
import { AUTH_LOGIN_COPY } from '@/constants/auth'
import { loginSchema, type LoginSchema } from '@/lib/validations/auth'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { API_ERROR_MESSAGES } from '@/types/api'
import { gooeyToast } from '@/components/ui/goey-toaster'

export function LoginForm() {
  const navigate  = useNavigate()
  const login     = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await authService.login(data)
      const { accessToken, user } = res.data.data

      if (user.role === 'user') {
        setError('root', { message: AUTH_LOGIN_COPY.errorInvalidRole })
        return
      }

      login(accessToken, user)
      gooeyToast.success(`Chào mừng, ${user.displayName}!`)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const code = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? ''
      const msg = API_ERROR_MESSAGES[code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* root error */}
      {errors.root && (
        <div className="flex items-start gap-2 rounded-xl bg-tertiary-container px-4 py-3">
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0 text-tertiary" />
          <p className="text-[13px] text-on-tertiary-container">{errors.root.message}</p>
        </div>
      )}

      {/* email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-on-surface-variant">
          {AUTH_LOGIN_COPY.emailLabel}
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder={AUTH_LOGIN_COPY.emailPlaceholder}
          className="border-b-2 border-outline-variant bg-transparent pb-2 pt-1 text-sm text-on-surface outline-none placeholder:text-outline-variant focus:border-primary"
          style={{ borderColor: errors.email ? 'var(--tertiary)' : undefined }}
        />
        {errors.email && (
          <span className="text-[12px] text-tertiary">{errors.email.message}</span>
        )}
      </div>

      {/* password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-on-surface-variant">
          {AUTH_LOGIN_COPY.passwordLabel}
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder={AUTH_LOGIN_COPY.passwordPlaceholder}
          className="border-b-2 border-outline-variant bg-transparent pb-2 pt-1 text-sm text-on-surface outline-none placeholder:text-outline-variant focus:border-primary"
          style={{ borderColor: errors.password ? 'var(--tertiary)' : undefined }}
        />
        {errors.password && (
          <span className="text-[12px] text-tertiary">{errors.password.message}</span>
        )}
      </div>

      {/* submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-xl bg-primary px-8 py-3 text-[13px] font-semibold text-primary-foreground transition-[opacity,background-color] hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? AUTH_LOGIN_COPY.loadingButton : AUTH_LOGIN_COPY.submitButton}
      </button>

      {/* role note */}
      <p className="text-center text-[12px] text-outline">{AUTH_LOGIN_COPY.roleNote}</p>
    </form>
  )
}
