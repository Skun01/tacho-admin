import { z } from 'zod'

export const adminDeckFormSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề bộ thẻ.'),
  description: z.string().trim().max(1000, 'Mô tả không được vượt quá 1000 ký tự.').optional().or(z.literal('')),
  coverImageFile: z.instanceof(File).nullable().optional(),
  visibility: z.enum(['Public', 'Private']),
  status: z.enum(['Draft', 'Published', 'Archived']),
  isOfficial: z.boolean(),
  typeId: z.string().optional().or(z.literal('')),
})

export type AdminDeckFormValues = z.infer<typeof adminDeckFormSchema>

export const adminDeckFolderFormSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tên thư mục.'),
  description: z.string().trim().max(500, 'Mô tả không được vượt quá 500 ký tự.').optional().or(z.literal('')),
})

export type AdminDeckFolderFormValues = z.infer<typeof adminDeckFolderFormSchema>

export const deckTypeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên loại bộ thẻ.')
    .max(100, 'Tên loại bộ thẻ không được vượt quá 100 ký tự.'),
})

export type DeckTypeFormValues = z.infer<typeof deckTypeFormSchema>
