import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { AUTH_PROFILE_COPY } from '@/constants/auth'
import { changePasswordSchema, type ChangePasswordSchema } from '@/lib/validations/auth'
import { useChangePassword } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword()

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = (data: ChangePasswordSchema) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => form.reset() },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_PROFILE_COPY.currentPasswordLabel}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_PROFILE_COPY.newPasswordLabel}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_PROFILE_COPY.confirmNewPasswordLabel}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 self-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={15} className="animate-spin" />}
          {AUTH_PROFILE_COPY.changePasswordButton}
        </Button>

      </form>
    </Form>
  )
}
