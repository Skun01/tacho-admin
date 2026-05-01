import { z } from 'zod'

// ── Exam Schemas ─────────────────────────────────────────────────────────────

export const createExamSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(500, 'Tiêu đề tối đa 500 ký tự'),
  level: z.enum(['N5', 'N4', 'N3', 'N2', 'N1'], { message: 'Cấp độ là bắt buộc' }),
  totalDurationMinutes: z.coerce
    .number({ message: 'Thời gian là bắt buộc' })
    .int()
    .min(1, 'Thời gian phải lớn hơn 0')
    .max(300, 'Thời gian tối đa 300 phút'),
})

export type CreateExamFormValues = z.infer<typeof createExamSchema>

export const editExamSchema = createExamSchema

export type EditExamFormValues = z.infer<typeof editExamSchema>

// ── Section Schemas ──────────────────────────────────────────────────────────

export const sectionSchema = z.object({
  sectionType: z.enum(['Moji', 'Bunpou', 'Dokkai', 'Choukai'], { message: 'Loại section là bắt buộc' }),
  orderIndex: z.coerce.number().int().min(0, 'Thứ tự >= 0'),
  durationMinutes: z.coerce.number().int().min(1, 'Thời gian phải lớn hơn 0'),
  maxScore: z.coerce.number().int().min(1, 'Điểm tối đa phải lớn hơn 0'),
  passScore: z.coerce.number().int().min(0, 'Điểm qua >= 0'),
}).refine((data) => data.passScore <= data.maxScore, {
  message: 'Điểm qua không được lớn hơn điểm tối đa',
  path: ['passScore'],
})

export type SectionFormValues = z.infer<typeof sectionSchema>

// ── Question Group Schemas ───────────────────────────────────────────────────

export const questionGroupSchema = z.object({
  instruction: z.string().trim().min(1, 'Hướng dẫn là bắt buộc').max(2000, 'Hướng dẫn tối đa 2000 ký tự'),
  passageText: z.string().trim().optional().or(z.literal('')),
  audioScript: z.string().trim().optional().or(z.literal('')),
  orderIndex: z.coerce.number().int().min(0, 'Thứ tự >= 0'),
  mondaiType: z.enum(['Mondai1', 'Mondai2', 'Mondai3', 'Mondai4', 'Mondai5']).optional().nullable(),
})

export type QuestionGroupFormValues = z.infer<typeof questionGroupSchema>

// ── Question Schemas ─────────────────────────────────────────────────────────

const optionSchema = z.object({
  id: z.string().optional(),
  label: z.enum(['A', 'B', 'C', 'D']),
  text: z.string().trim().min(1, 'Nội dung đáp án là bắt buộc'),
  imageUrl: z.string().nullable().optional(),
  optionType: z.enum(['Text', 'Image', 'TextAndImage']),
  isCorrect: z.boolean(),
})

export const questionSchema = z.object({
  questionText: z.string().trim().min(1, 'Nội dung câu hỏi là bắt buộc').max(5000, 'Tối đa 5000 ký tự'),
  imageUrl: z.string().nullable().optional(),
  imageCaption: z.string().nullable().optional(),
  explanation: z.string().trim().optional().or(z.literal('')),
  score: z.coerce.number().int().min(1, 'Điểm phải lớn hơn 0'),
  orderIndex: z.coerce.number().int().min(0, 'Thứ tự >= 0'),
  options: z
    .array(optionSchema)
    .min(2, 'Phải có ít nhất 2 đáp án')
    .max(4, 'Tối đa 4 đáp án'),
}).refine(
  (data) => data.options.filter((o) => o.isCorrect).length === 1,
  { message: 'Phải có chính xác 1 đáp án đúng', path: ['options'] },
)

export type QuestionFormValues = z.infer<typeof questionSchema>

// ── AI Generate Schemas ──────────────────────────────────────────────────────

export const aiGenerateSchema = z.object({
  level: z.enum(['N5', 'N4', 'N3', 'N2', 'N1'], { message: 'Cấp độ là bắt buộc' }),
  sectionType: z.enum(['Moji', 'Bunpou', 'Dokkai', 'Choukai'], { message: 'Loại section là bắt buộc' }),
  topic: z.string().trim().min(1, 'Chủ đề là bắt buộc').max(500, 'Chủ đề tối đa 500 ký tự'),
  count: z.coerce.number().int().min(1, 'Tối thiểu 1 câu').max(20, 'Tối đa 20 câu'),
})

export type AiGenerateFormValues = z.infer<typeof aiGenerateSchema>
