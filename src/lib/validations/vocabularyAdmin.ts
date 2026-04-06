import { z } from 'zod'
import { VOCABULARY_LEVEL_OPTIONS, VOCABULARY_STATUS_OPTIONS } from '@/types/vocabularyAdmin'

const vocabularyMeaningSchema = z.object({
  partOfSpeech: z.string().trim().min(1, 'Từ loại là bắt buộc'),
  definitions: z.array(z.string().trim().min(1, 'Nghĩa không được để trống')).min(1, 'Ít nhất một nghĩa là bắt buộc'),
})

export const vocabularyUpsertSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề tối đa 200 ký tự'),
  summary: z.string().trim().min(1, 'Tóm tắt là bắt buộc').max(2000, 'Tóm tắt tối đa 2000 ký tự'),
  reading: z.string(),
  level: z.enum(VOCABULARY_LEVEL_OPTIONS).nullable(),
  status: z.enum(VOCABULARY_STATUS_OPTIONS).nullable(),
  wordType: z.string(),
  tags: z.array(z.string().trim().min(1, 'Tag không được để trống')),
  meanings: z.array(vocabularyMeaningSchema).min(1, 'Ít nhất một nghĩa là bắt buộc'),
  synonyms: z.array(z.string().trim().min(1, 'Từ đồng nghĩa không được để trống')),
  antonyms: z.array(z.string().trim().min(1, 'Từ trái nghĩa không được để trống')),
  relatedPhrases: z.array(z.string().trim().min(1, 'Cụm liên quan không được để trống')),
})

export type VocabularyUpsertInput = z.infer<typeof vocabularyUpsertSchema>
