import { z } from 'zod'

export const createShadowingTopicSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().trim().min(1, 'Mô tả là bắt buộc'),
  coverImageFile: z.instanceof(File).nullable().optional(),
  level: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']).optional(),
  visibility: z.enum(['Public', 'Private']),
  status: z.enum(['Draft', 'Published', 'Archived']),
})

export type CreateShadowingTopicFormValues = z.infer<typeof createShadowingTopicSchema>

export const editShadowingTopicSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().trim().min(1, 'Mô tả là bắt buộc'),
  coverImageFile: z.instanceof(File).nullable().optional(),
  level: z.enum(['N1', 'N2', 'N3', 'N4', 'N5']).optional(),
  visibility: z.enum(['Public', 'Private']),
  status: z.enum(['Draft', 'Published', 'Archived']),
})

export type EditShadowingTopicFormValues = z.infer<typeof editShadowingTopicSchema>
