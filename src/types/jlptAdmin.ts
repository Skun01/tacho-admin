// JLPT Admin Types for learning-admin
// API Endpoints: /api/exams/*, /api/questions/*, /api/ai/questions/*

// ── Shared Enums ────────────────────────────────────────────────────────────

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type PublishStatus = 'Draft' | 'Published' | 'Archived'

export type SectionType = 'Moji' | 'Bunpou' | 'Dokkai' | 'Choukai'

export type OptionLabel = 'A' | 'B' | 'C' | 'D'

export type OptionType = 'Text' | 'Image' | 'TextAndImage'

export type AiQuestionStatus = 'Pending' | 'Edited' | 'Approved' | 'Rejected'

export type ChoukaiMondaiType = 'Mondai1' | 'Mondai2' | 'Mondai3' | 'Mondai4' | 'Mondai5'

// ── Exam Request Types ──────────────────────────────────────────────────────

export interface SearchExamsQuery {
  keyword?: string
  level?: JlptLevel
  status?: PublishStatus
  page?: number
  pageSize?: number
}

export interface CreateExamPayload {
  title: string
  level: JlptLevel
  totalDurationMinutes: number
}

export interface UpdateExamPayload {
  title: string
  level: JlptLevel
  totalDurationMinutes: number
}

// ── Section Request Types ───────────────────────────────────────────────────

export interface CreateSectionPayload {
  sectionType: SectionType
  orderIndex: number
  durationMinutes: number
  maxScore: number
  passScore: number
}

export interface UpdateSectionPayload {
  sectionType: SectionType
  orderIndex: number
  durationMinutes: number
  maxScore: number
  passScore: number
}

// ── Question Group Request Types ────────────────────────────────────────────

export interface CreateQuestionGroupPayload {
  passageText?: string | null
  audioUrl?: string | null
  audioScript?: string | null
  instruction: string
  orderIndex: number
  mondaiType?: ChoukaiMondaiType | null
}

export interface UpdateQuestionGroupPayload {
  passageText?: string | null
  audioUrl?: string | null
  audioScript?: string | null
  instruction: string
  orderIndex: number
  mondaiType?: ChoukaiMondaiType | null
}

// ── Question Request Types ──────────────────────────────────────────────────

export interface QuestionOptionPayload {
  id?: string
  label: OptionLabel
  text: string
  imageUrl?: string | null
  optionType: OptionType
  isCorrect: boolean
}

export interface CreateQuestionPayload {
  groupId: string
  questionText: string
  imageUrl?: string | null
  imageCaption?: string | null
  explanation?: string | null
  score: number
  orderIndex: number
  options: QuestionOptionPayload[]
}

export interface UpdateQuestionPayload {
  questionText: string
  imageUrl?: string | null
  imageCaption?: string | null
  explanation?: string | null
  score: number
  orderIndex: number
  options: QuestionOptionPayload[]
}

export interface BulkCreateQuestionsPayload {
  questions: CreateQuestionPayload[]
}

export interface ReorderQuestionsPayload {
  items: Array<{ id: string; orderIndex: number }>
}

// ── Question Search Request ─────────────────────────────────────────────────

export interface SearchQuestionsQuery {
  keyword?: string
  level?: JlptLevel
  sectionType?: SectionType
  page?: number
  pageSize?: number
}

// ── AI Question Request Types ───────────────────────────────────────────────

export interface GenerateAiQuestionsPayload {
  level: JlptLevel
  sectionType: SectionType
  topic: string
  count: number
  questionGroupId?: string | null
}

export interface UpdateAiQuestionPayload {
  generatedData: string
}

export interface SearchAiQuestionsQuery {
  level?: JlptLevel
  sectionType?: SectionType
  status?: AiQuestionStatus
  page?: number
  pageSize?: number
}

// ── Exam Response Types ─────────────────────────────────────────────────────

export interface ExamListItemResponse {
  id: string
  title: string
  level: JlptLevel
  totalDurationMinutes: number
  status: PublishStatus
  sectionsCount: number
  createdBy: string
  creatorName: string
  createdAt: string
  updatedAt: string | null
}

export interface QuestionGroupQuestionOptionResponse {
  id: string
  label: OptionLabel
  text: string
  imageUrl: string | null
  optionType: OptionType
  isCorrect: boolean
}

export interface QuestionGroupQuestionResponse {
  id: string
  groupId: string
  questionText: string
  imageUrl: string | null
  imageCaption: string | null
  explanation: string | null
  score: number
  orderIndex: number
  options: QuestionGroupQuestionOptionResponse[]
  createdAt: string
  updatedAt: string | null
}

export interface QuestionGroupResponse {
  id: string
  passageText: string | null
  audioUrl: string | null
  audioScript: string | null
  instruction: string
  orderIndex: number
  mondaiType: ChoukaiMondaiType | null
  questions: QuestionGroupQuestionResponse[]
  createdAt: string
  updatedAt: string | null
}

export interface ExamSectionResponse {
  id: string
  sectionType: SectionType
  orderIndex: number
  durationMinutes: number
  maxScore: number
  passScore: number
  questionGroupsCount: number
  questionsCount: number
  questionGroups: QuestionGroupResponse[]
  createdAt: string
  updatedAt: string | null
}

export interface ExamDetailResponse {
  id: string
  title: string
  level: JlptLevel
  totalDurationMinutes: number
  status: PublishStatus
  createdBy: string
  creatorName: string
  sections: ExamSectionResponse[]
  createdAt: string
  updatedAt: string | null
}

// ── Question Response Types ─────────────────────────────────────────────────

export interface QuestionOptionResponse {
  id: string
  label: OptionLabel
  text: string
  imageUrl: string | null
  optionType: OptionType
  isCorrect: boolean
}

export interface QuestionResponse {
  id: string
  groupId: string
  questionText: string
  imageUrl: string | null
  imageCaption: string | null
  explanation: string | null
  score: number
  orderIndex: number
  options: QuestionOptionResponse[]
  createdAt: string
  updatedAt: string | null
}

// ── AI Question Response Types ──────────────────────────────────────────────

export interface AiGeneratedQuestionResponse {
  id: string
  level: JlptLevel
  sectionType: SectionType
  topic: string
  generatedData: string
  status: AiQuestionStatus
  reviewedBy: string | null
  reviewerName: string | null
  reviewedAt: string | null
  questionId: string | null
  createdBy: string
  creatorName: string
  createdAt: string
  updatedAt: string | null
}

export interface AiGeneratedDataQuestion {
  questionText: string
  explanation: string | null
  options: Array<{
    label: string
    text: string
    isCorrect: boolean
  }>
}

export interface AiGeneratedData {
  passage: string | null
  script: string | null
  questions: AiGeneratedDataQuestion[]
}

// ── List Result Types ───────────────────────────────────────────────────────

export interface PaginatedMeta {
  total: number
  page: number
  pageSize: number
}

export interface ExamListResult {
  items: ExamListItemResponse[]
  meta: PaginatedMeta | null
}

export interface QuestionListResult {
  items: QuestionResponse[]
  meta: PaginatedMeta | null
}

export interface AiQuestionListResult {
  items: AiGeneratedQuestionResponse[]
  meta: PaginatedMeta | null
}
