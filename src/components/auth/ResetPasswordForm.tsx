import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router'
import { SpinnerGapIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
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
import { resetPasswordSchema, type ResetPasswordSchema } from '@/lib/validations/auth'
import { useResetPassword } from '@/hooks/useAuth'
import { AUTH_RESET_PASSWORD_COPY } from '@/constants/auth'

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { mutate: resetPassword, isPending } = useResetPassword()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: '' },
  })

  const onSubmit = (data: ResetPasswordSchema) => resetPassword(data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Hidden token field — đọc từ URL */}
        <input type="hidden" {...form.register('token')} />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_RESET_PASSWORD_COPY.newPasswordLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={AUTH_RESET_PASSWORD_COPY.newPasswordPlaceholder}
                    autoComplete="new-password"
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
                    {showPassword ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || !token}
          className="mt-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={15} className="animate-spin" />}
          {isPending
            ? AUTH_RESET_PASSWORD_COPY.loadingButton
            : AUTH_RESET_PASSWORD_COPY.submitButton}
        </Button>

        <Link
          to="/login"
          className="text-center text-sm hover:underline"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          {AUTH_RESET_PASSWORD_COPY.backToLogin}
        </Link>
      </form>
    </Form>
  )
}
