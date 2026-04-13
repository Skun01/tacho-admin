import { z } from 'zod'
import { KANJI_LEVEL_OPTIONS, KANJI_STATUS_OPTIONS } from '@/types/kanjiAdmin'

const kanjiRadicalSchema = z.object({
  character: z.string().trim().min(1, 'Ký tự bộ thủ là bắt buộc').max(20, 'Ký tự bộ thủ tối đa 20 ký tự'),
  meaningVi: z.string().trim().min(1, 'Nghĩa bộ thủ là bắt buộc').max(500, 'Nghĩa bộ thủ tối đa 500 ký tự'),
})

export const kanjiUpsertSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề tối đa 200 ký tự'),
  summary: z.string().trim().min(1, 'Tóm tắt là bắt buộc').max(2000, 'Tóm tắt tối đa 2000 ký tự'),
  level: z.enum(KANJI_LEVEL_OPTIONS).nullable(),
  status: z.enum(KANJI_STATUS_OPTIONS).nullable(),
  tags: z.array(z.string().trim().min(1, 'Tag không được để trống')).max(20, 'Tối đa 20 tag'),
  kanji: z.string().trim().min(1, 'Chữ Hán tự là bắt buộc').max(20, 'Chữ Hán tự tối đa 20 ký tự'),
  strokeCount: z
    .number({ invalid_type_error: 'Số nét phải là số nguyên dương' })
    .int('Số nét phải là số nguyên')
    .positive('Số nét phải lớn hơn 0'),
  strokeOrderUrl: z.string().max(2000, 'URL thứ tự nét tối đa 2000 ký tự').nullable(),
  onyomi: z.array(z.string().trim().min(1, 'Âm On không được để trống').max(100, 'Âm On tối đa 100 ký tự')).max(20, 'Tối đa 20 âm On'),
  kunyomi: z.array(z.string().trim().min(1, 'Âm Kun không được để trống').max(100, 'Âm Kun tối đa 100 ký tự')).max(20, 'Tối đa 20 âm Kun'),
  hanViet: z.string().trim().max(200, 'Âm Hán Việt tối đa 200 ký tự').nullable(),
  meaningVi: z.string().trim().min(1, 'Nghĩa tiếng Việt là bắt buộc').max(1000, 'Nghĩa tiếng Việt tối đa 1000 ký tự'),
  radicals: z
    .array(kanjiRadicalSchema)
    .min(1, 'Cần ít nhất 1 bộ thủ')
    .max(30, 'Tối đa 30 bộ thủ'),
}).refine(
  (data) => {
    const characters = data.radicals.map((r) => r.character.trim()).filter(Boolean)
    return new Set(characters).size === characters.length
  },
  { message: 'Ký tự bộ thủ không được trùng nhau trong cùng một kanji', path: ['radicals'] },
)

export type KanjiUpsertInput = z.infer<typeof kanjiUpsertSchema>
