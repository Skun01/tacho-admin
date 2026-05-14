import { z } from 'zod'
import { GRAMMAR_LEVEL_OPTIONS, GRAMMAR_REGISTER_OPTIONS, GRAMMAR_RELATION_TYPE_OPTIONS, GRAMMAR_STATUS_OPTIONS } from '@/types/grammarAdmin'

const grammarStructureSchema = z.object({
  pattern: z.string().trim().min(1, 'Mẫu cấu trúc là bắt buộc').max(1000, 'Mẫu cấu trúc tối đa 1000 ký tự'),
  annotations: z.record(z.string(), z.string().max(1000, 'Chú thích tối đa 1000 ký tự')).nullable(),
})

const grammarRelationSchema = z.object({
  relatedId: z.string().trim().min(1, 'ID ngữ pháp liên quan là bắt buộc'),
  relationType: z.enum(GRAMMAR_RELATION_TYPE_OPTIONS),
  title: z.string().optional(),
  summary: z.string().optional(),
})

const grammarResourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'Tiêu đề tài liệu là bắt buộc'),
  url: z.string().trim().url('URL không hợp lệ'),
})

const grammarSentenceSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, 'Câu ví dụ là bắt buộc').max(1000, 'Câu ví dụ tối đa 1000 ký tự'),
  meaning: z.string().trim().min(1, 'Nghĩa câu ví dụ là bắt buộc').max(1000, 'Nghĩa câu ví dụ tối đa 1000 ký tự'),
  level: z.enum(GRAMMAR_LEVEL_OPTIONS).nullable(),
  blankWord: z.string().trim().max(200, 'Từ trống tối đa 200 ký tự').optional().default(''),
  hint: z.string().trim().max(500, 'Gợi ý tối đa 500 ký tự').optional().default(''),
  answerList: z.array(z.string().trim()).optional().default([]),
})

export const grammarUpsertSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề tối đa 200 ký tự'),
  summary: z.string().trim().min(1, 'Tóm tắt là bắt buộc').max(2000, 'Tóm tắt tối đa 2000 ký tự'),
  level: z.enum(GRAMMAR_LEVEL_OPTIONS).nullable(),
  status: z.enum(GRAMMAR_STATUS_OPTIONS).nullable(),
  tags: z.array(z.string().trim().min(1, 'Tag không được để trống')),
  structures: z.array(grammarStructureSchema),
  explanation: z.string().max(10000, 'Giải thích tối đa 10000 ký tự').nullable(),
  caution: z.string().max(5000, 'Lưu ý tối đa 5000 ký tự').nullable(),
  register: z.enum(GRAMMAR_REGISTER_OPTIONS).nullable(),
  alternateForms: z.array(z.string().trim().min(1, 'Dạng thay thế không được để trống')),
  relations: z.array(grammarRelationSchema),
  resources: z.array(grammarResourceSchema),
  sentences: z.array(grammarSentenceSchema),
})

export type GrammarUpsertInput = z.infer<typeof grammarUpsertSchema>
