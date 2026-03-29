import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Email không hợp lệ.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
})

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Vui lòng nhập tên hiển thị.')
    .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự.'),
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Email không hợp lệ.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
