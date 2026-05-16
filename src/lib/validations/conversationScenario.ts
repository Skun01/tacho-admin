import { z } from 'zod'

export const conversationScenarioSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên kịch bản không được để trống')
    .max(100, 'Tên kịch bản tối đa 100 ký tự'),
  icon: z
    .string()
    .min(1, 'Icon không được để trống')
    .max(50, 'Icon tối đa 50 ký tự'),
  description: z
    .string()
    .min(1, 'Mô tả không được để trống')
    .max(500, 'Mô tả tối đa 500 ký tự'),
  sortOrder: z.coerce
    .number()
    .int('Thứ tự phải là số nguyên')
    .min(0, 'Thứ tự phải >= 0'),
  isActive: z.boolean(),
})

export type ConversationScenarioFormValues = z.infer<typeof conversationScenarioSchema>
