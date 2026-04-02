import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { EyeIcon, EyeSlashIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginSchema } from '@/lib/validations/auth'
import { useLogin } from '@/hooks/useAuth'
import { AUTH_LOGIN_COPY } from '@/constants/auth'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginSchema) => login(data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_LOGIN_COPY.emailLabel}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder={AUTH_LOGIN_COPY.emailPlaceholder}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{AUTH_LOGIN_COPY.passwordLabel}</FormLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                  style={{ color: 'var(--on-surface-variant)' }}
                  tabIndex={-1}
                >
                  {AUTH_LOGIN_COPY.forgotPassword}
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={AUTH_LOGIN_COPY.passwordPlaceholder}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--on-surface-variant)' }}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword
                      ? <EyeSlashIcon size={16} />
                      : <EyeIcon size={16} />
                    }
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={15} className="animate-spin" />}
          {isPending ? AUTH_LOGIN_COPY.loadingButton : AUTH_LOGIN_COPY.submitButton}
        </Button>

      </form>
    </Form>
  )
}
