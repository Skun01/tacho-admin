export const KANJI_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export const KANJI_STATUS_OPTIONS = ['Draft', 'Published', 'Archived'] as const

export type KanjiLevel = (typeof KANJI_LEVEL_OPTIONS)[number]
export type KanjiStatus = (typeof KANJI_STATUS_OPTIONS)[number]

export const KANJI_STATUS_LABELS: Record<KanjiStatus, string> = {
  Draft: 'Bản nháp',
  Published: 'Đã xuất bản',
  Archived: 'Đã lưu trữ',
}

export function getKanjiStatusLabel(status: KanjiStatus) {
  return KANJI_STATUS_LABELS[status]
}

export interface KanjiAdminItem {
  id: string
  title: string
  summary: string
  level: KanjiLevel | null
  tags: string[]
  status: KanjiStatus
  createdAt: string
  updatedAt: string | null
  kanji: string
  strokeCount: number
  hanViet: string | null
  meaningVi: string
  radicalCount: number
}

export interface KanjiRadicalInput {
  character: string
  meaningVi: string
}

export interface KanjiRadicalDetail {
  id: string
  character: string
  meaningVi: string
  kanjiCardId: string | null
}

export interface KanjiAdminDetail extends KanjiAdminItem {
  cardType: 'Kanji'
  strokeOrderUrl: string | null
  onyomi: string[]
  kunyomi: string[]
  radicals: KanjiRadicalDetail[]
  userNotes: unknown[]
}

export interface KanjiUpsertPayload {
  title: string
  summary: string
  level: KanjiLevel | null
  tags: string[]
  status: KanjiStatus | null
  kanji: string
  strokeCount: number
  strokeOrderUrl: string | null
  onyomi: string[]
  kunyomi: string[]
  hanViet: string | null
  meaningVi: string
  radicals: KanjiRadicalInput[]
}

export interface KanjiSearchQuery {
  q?: string
  level?: KanjiLevel
  status?: KanjiStatus
  strokeCountMin?: number
  strokeCountMax?: number
  radical?: string
  createdByMe?: boolean
  page: number
  pageSize: number
}

// --- Import types ---

export interface KanjiImportItem {
  rowNumber: number | null
  title: string
  summary: string
  level: KanjiLevel | null
  tags: string[]
  status: KanjiStatus | null
  kanji: string
  strokeCount: number
  strokeOrderUrl: string | null
  onyomi: string[]
  kunyomi: string[]
  hanViet: string | null
  meaningVi: string
  radicals: KanjiRadicalInput[]
}

export interface KanjiImportPayload {
  items: KanjiImportItem[]
}

export interface KanjiImportPreviewItem {
  rowNumber: number | null
  title: string
  kanji: string
  isValid: boolean
  errors: string[]
}

export interface KanjiImportPreviewResult {
  totalItems: number
  validItems: number
  invalidItems: number
  items: KanjiImportPreviewItem[]
}

export interface KanjiImportCommitItem {
  rowNumber: number | null
  title: string
  kanji: string
  isSuccess: boolean
  action: string
  cardId?: string
  errors: string[]
}

export interface KanjiImportCommitResult {
  totalItems: number
  successfulItems: number
  failedItems: number
  hasValidationErrors: boolean
  items: KanjiImportCommitItem[]
}
