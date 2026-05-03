export const GRAMMAR_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export const GRAMMAR_STATUS_OPTIONS = ['Draft', 'Published', 'Archived'] as const
export const GRAMMAR_REGISTER_OPTIONS = ['Standard', 'Formal', 'Polite', 'Casual'] as const
export const GRAMMAR_RELATION_TYPE_OPTIONS = ['Similar', 'Contrasting'] as const

export type GrammarLevel = (typeof GRAMMAR_LEVEL_OPTIONS)[number]
export type GrammarStatus = (typeof GRAMMAR_STATUS_OPTIONS)[number]
export type GrammarRegister = (typeof GRAMMAR_REGISTER_OPTIONS)[number]
export type GrammarRelationType = (typeof GRAMMAR_RELATION_TYPE_OPTIONS)[number]

export const GRAMMAR_STATUS_LABELS: Record<GrammarStatus, string> = {
  Draft: 'Bản nháp',
  Published: 'Đã xuất bản',
  Archived: 'Đã lưu trữ',
}

export function getGrammarStatusLabel(status: GrammarStatus) {
  return GRAMMAR_STATUS_LABELS[status]
}

export const GRAMMAR_REGISTER_LABELS: Record<GrammarRegister, string> = {
  Standard: 'Chuẩn',
  Formal: 'Trang trọng',
  Polite: 'Lịch sự',
  Casual: 'Thân mật',
}

export function normalizeGrammarRegister(register: string | null | undefined): GrammarRegister | null {
  const normalizedInput = register?.trim().toLowerCase()

  if (!normalizedInput) return null

  for (const option of GRAMMAR_REGISTER_OPTIONS) {
    if (option.toLowerCase() === normalizedInput) return option
    if (GRAMMAR_REGISTER_LABELS[option].trim().toLowerCase() === normalizedInput) return option
  }

  return null
}

export function getGrammarRegisterLabel(register: string) {
  const normalizedRegister = normalizeGrammarRegister(register)
  return normalizedRegister ? GRAMMAR_REGISTER_LABELS[normalizedRegister] : register
}

export const GRAMMAR_RELATION_TYPE_LABELS: Record<GrammarRelationType, string> = {
  Similar: 'Tương tự',
  Contrasting: 'Tương phản',
}

export interface GrammarAdminItem {
  id: string
  title: string
  summary: string
  level: GrammarLevel | null
  tags: string[]
  status: GrammarStatus
  createdAt: string
  updatedAt: string | null
  register: GrammarRegister | null
  structuresCount: number
  alternateForms: string[]
}

export interface GrammarStructureInput {
  pattern: string
  annotations: Record<string, string> | null
}

export interface GrammarRelationInput {
  relatedId: string
  relationType: GrammarRelationType
}

export interface GrammarRelationDetail {
  relatedId: string
  title: string
  summary: string
  relationType: GrammarRelationType
}

export interface GrammarResourceInput {
  id?: string
  title: string
  url: string
}

export interface GrammarSentenceUpsertInput {
  id?: string
  text: string
  meaning: string
  level: GrammarLevel | null
}

export interface GrammarAdminDetail extends GrammarAdminItem {
  cardType: 'Grammar'
  structures: GrammarStructureInput[]
  explanation: string | null
  caution: string | null
  relations: GrammarRelationDetail[]
  resources: GrammarResourceInput[]
  sentences: GrammarSentenceUpsertInput[]
  userNotes: unknown[]
}

export interface GrammarUpsertPayload {
  title: string
  summary: string
  level: GrammarLevel | null
  tags: string[]
  status: GrammarStatus | null
  structures: GrammarStructureInput[]
  explanation: string | null
  caution: string | null
  register: GrammarRegister | null
  alternateForms: string[]
  relations: GrammarRelationInput[]
  resources: GrammarResourceInput[]
  sentences: GrammarSentenceUpsertInput[]
}

export interface GrammarSearchQuery {
  q?: string
  level?: GrammarLevel
  status?: GrammarStatus
  register?: GrammarRegister
  createdByMe?: boolean
  page: number
  pageSize: number
}

// --- Import types ---

export interface GrammarImportSentenceItem {
  text: string
  meaning: string
  level: GrammarLevel | null
}

export interface GrammarImportItem {
  rowNumber: number | null
  title: string
  summary: string
  level: GrammarLevel | null
  tags: string[]
  status: GrammarStatus | null
  structures: GrammarStructureInput[]
  explanation: string | null
  caution: string | null
  register: GrammarRegister | null
  alternateForms: string[]
  relations: GrammarRelationInput[]
  resources: GrammarResourceInput[]
  sentences: GrammarImportSentenceItem[]
}

export interface GrammarImportPayload {
  items: GrammarImportItem[]
}

export interface GrammarImportPreviewItem {
  rowNumber: number | null
  title: string
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface GrammarImportPreviewResult {
  totalItems: number
  validItems: number
  invalidItems: number
  items: GrammarImportPreviewItem[]
}

export interface GrammarImportCommitItem {
  rowNumber: number | null
  title: string
  isSuccess: boolean
  action: string
  cardId?: string
  errors: string[]
}

export interface GrammarImportCommitResult {
  totalItems: number
  successfulItems: number
  failedItems: number
  hasValidationErrors: boolean
  items: GrammarImportCommitItem[]
}
