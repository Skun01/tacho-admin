import { z } from 'zod'

export const sentenceConfigItemSchema = z.object({
  sentenceId: z.string().min(1).max(50),
  position: z.number().int().min(1),
  blankWord: z.string().max(500).nullable().optional(),
  hint: z.string().max(1000).nullable().optional(),
  answerList: z.array(z.string()).optional(),
})

export const cardConfigFormSchema = z.object({
  summary: z
    .string()
    .min(1, { message: 'Tóm tắt không được để trống.' })
    .max(1000, { message: 'Tóm tắt không được vượt quá 1000 ký tự.' }),
  sentences: z.array(sentenceConfigItemSchema),
})

export const attachSentenceSchema = z.object({
  sentenceId: z.string().min(1).max(50),
  position: z.number().int().min(1),
  blankWord: z.string().max(500).nullable().optional(),
  hint: z.string().max(1000).nullable().optional(),
  answerList: z.array(z.string()).optional(),
})

export type CardConfigFormValues = z.infer<typeof cardConfigFormSchema>
export type AttachSentenceFormValues = z.infer<typeof attachSentenceSchema>
