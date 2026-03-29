import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { AUTH_LOGIN_COPY } from '@/constants/auth'
import { loginSchema, type LoginSchema } from '@/lib/validations/auth'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (_data: LoginSchema) => {
    // TODO: wire up authService.login
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          {AUTH_LOGIN_COPY.emailLabel}
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder={AUTH_LOGIN_COPY.emailPlaceholder}
          className="border-b border-foreground/40 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {AUTH_LOGIN_COPY.passwordLabel}
          </label>
          <a href="#" className="text-xs text-secondary hover:text-primary">
            {AUTH_LOGIN_COPY.forgotPassword}
          </a>
        </div>
        <input
          {...register('password')}
          type="password"
          placeholder={AUTH_LOGIN_COPY.passwordPlaceholder}
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
        {isSubmitting ? AUTH_LOGIN_COPY.loadingButton : AUTH_LOGIN_COPY.submitButton}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {AUTH_LOGIN_COPY.registerPrompt}{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          {AUTH_LOGIN_COPY.registerLink}
        </Link>
      </p>
    </form>
  )
}
