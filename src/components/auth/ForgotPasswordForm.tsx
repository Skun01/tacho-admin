import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { SpinnerGapIcon, CheckCircleIcon } from '@phosphor-icons/react'
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
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/validations/auth'
import { useForgotPassword } from '@/hooks/useAuth'
import { AUTH_FORGOT_PASSWORD_COPY } from '@/constants/auth'

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => setSent(true),
  })

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircleIcon
          size={48}
          weight="duotone"
          style={{ color: 'var(--primary)' }}
        />
        <h2
          className="font-heading-vn text-xl"
          style={{ color: 'var(--on-surface)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.successHeading}
        </h2>
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {AUTH_FORGOT_PASSWORD_COPY.successMessage}
        </p>
        <Link
          to="/login"
          className="mt-2 text-sm font-semibold hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.backToLogin}
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => forgotPassword(data))}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_FORGOT_PASSWORD_COPY.emailLabel}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder={AUTH_FORGOT_PASSWORD_COPY.emailPlaceholder}
                  autoComplete="email"
                />
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
          {isPending
            ? AUTH_FORGOT_PASSWORD_COPY.loadingButton
            : AUTH_FORGOT_PASSWORD_COPY.submitButton}
        </Button>

        <Link
          to="/login"
          className="text-center text-sm hover:underline"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.backToLogin}
        </Link>
      </form>
    </Form>
  )
}
