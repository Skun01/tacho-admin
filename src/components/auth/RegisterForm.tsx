import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { AUTH_REGISTER_COPY } from '@/constants/auth'
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { API_ERROR_MESSAGES } from '@/types/api'
import { gooeyToast } from '@/components/ui/goey-toaster'

export function RegisterForm() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await authService.register({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      })

      const { accessToken, user } = res.data.data
      if (user.role === 'user') {
        setError('root', { message: 'Tài khoản mới chưa có quyền truy cập trang quản trị.' })
        return
      }

      login(accessToken, user)
      gooeyToast.success(`Chào mừng, ${user.displayName}!`)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : ''
      const msg = API_ERROR_MESSAGES[code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'
      setError('root', { message: msg })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {errors.root && (
        <p className="rounded-xl bg-tertiary-container px-4 py-3 text-[13px] text-on-tertiary-container">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          {AUTH_REGISTER_COPY.displayNameLabel}
        </label>
        <input
          {...register('displayName')}
          type="text"
          placeholder={AUTH_REGISTER_COPY.displayNamePlaceholder}
          className="border-b border-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {errors.displayName && (
          <span className="text-xs text-destructive">{errors.displayName.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          {AUTH_REGISTER_COPY.emailLabel}
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder={AUTH_REGISTER_COPY.emailPlaceholder}
          className="border-b border-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          {AUTH_REGISTER_COPY.passwordLabel}
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder={AUTH_REGISTER_COPY.passwordPlaceholder}
          className="border-b border-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {errors.password && (
          <span className="text-xs text-destructive">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? AUTH_REGISTER_COPY.loadingButton : AUTH_REGISTER_COPY.submitButton}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {AUTH_REGISTER_COPY.loginPrompt}{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {AUTH_REGISTER_COPY.loginLink}
        </Link>
      </p>
    </form>
  )
}
