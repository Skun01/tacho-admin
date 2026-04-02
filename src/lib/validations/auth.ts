import { z } from 'zod'

// Đồng bộ với FluentValidation rules ở backend
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự.').max(100),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không hợp lệ.'),
  newPassword: z
    .string()
    .min(8, 'Mật khẩu ít nhất 8 ký tự.')
    .max(100, 'Mật khẩu tối đa 100 ký tự.'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự.'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới ít nhất 8 ký tự.')
      .max(100, 'Mật khẩu tối đa 100 ký tự.'),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmNewPassword'],
  })

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Tên hiển thị ít nhất 2 ký tự.')
    .max(50, 'Tên hiển thị tối đa 50 ký tự.'),
  avatarUrl: z
    .string()
    .url('URL ảnh không hợp lệ.')
    .optional()
    .or(z.literal('')),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
