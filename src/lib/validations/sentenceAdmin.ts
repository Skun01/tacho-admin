import { z } from 'zod'
import { SENTENCE_LEVEL_OPTIONS } from '@/types/sentenceAdmin'

export const sentenceUpsertSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Câu tiếng Nhật là bắt buộc')
    .max(1000, 'Câu tiếng Nhật tối đa 1000 ký tự'),
  meaning: z
    .string()
    .trim()
    .min(1, 'Nghĩa tiếng Việt là bắt buộc')
    .max(1000, 'Nghĩa tiếng Việt tối đa 1000 ký tự'),
  level: z.enum(SENTENCE_LEVEL_OPTIONS).optional(),
})

export type SentenceUpsertInput = z.infer<typeof sentenceUpsertSchema>
