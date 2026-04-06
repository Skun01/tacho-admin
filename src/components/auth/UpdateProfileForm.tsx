import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { AUTH_PROFILE_COPY } from '@/constants/auth'
import { updateProfileSchema, type UpdateProfileSchema } from '@/lib/validations/auth'
import { useUpdateProfile } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
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
import { ImageUpload } from '@/components/ui/image-upload'

export function UpdateProfileForm() {
  const user = useAuthStore((s) => s.user)
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const hasAvatarFileError = false
  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      avatarFile: null,
      removeAvatar: false,
    },
  })
  
  const isRemovingAvatar = useWatch({ control: form.control, name: 'removeAvatar' })

  // Sync khi user thay đổi sau khi save thành công
  useEffect(() => {
    form.reset({
      displayName: user?.displayName ?? '',
      avatarFile: null,
      removeAvatar: false,
    })
  }, [user, form])

  const onSubmit = (data: UpdateProfileSchema) => {
    updateProfile({
      displayName: data.displayName,
      avatarFile: data.avatarFile ?? null,
      removeAvatar: data.removeAvatar,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_PROFILE_COPY.displayNameLabel}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={AUTH_PROFILE_COPY.displayNamePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_PROFILE_COPY.avatarFileLabel}</FormLabel>
              <FormControl>
                <ImageUpload
                  isAvatar
                  defaultPreview={isRemovingAvatar ? null : user?.avatarUrl}
                  value={field.value}
                  onChange={(file) => {
                    field.onChange(file)
                    form.setValue('removeAvatar', false, { shouldDirty: true })
                  }}
                  onRemove={() => {
                    field.onChange(null)
                    form.setValue('removeAvatar', true, { shouldDirty: true })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || hasAvatarFileError}
          className="mt-1 self-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={15} className="animate-spin" />}
          {AUTH_PROFILE_COPY.saveProfileButton}
        </Button>

      </form>
    </Form>
  )
}
