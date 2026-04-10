export const VOCABULARY_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export const VOCABULARY_STATUS_OPTIONS = ['Draft', 'Published', 'Archived'] as const
export const VOCABULARY_WORD_TYPE_OPTIONS = ['Native', 'SinoJapanese', 'Loanword'] as const

export type VocabularyLevel = (typeof VOCABULARY_LEVEL_OPTIONS)[number]
export type VocabularyStatus = (typeof VOCABULARY_STATUS_OPTIONS)[number]
export type VocabularyWordType = (typeof VOCABULARY_WORD_TYPE_OPTIONS)[number]

export const VOCABULARY_STATUS_LABELS: Record<VocabularyStatus, string> = {
  Draft: 'Bản nháp',
  Published: 'Đã xuất bản',
  Archived: 'Đã lưu trữ',
}

export function getVocabularyStatusLabel(status: VocabularyStatus) {
  return VOCABULARY_STATUS_LABELS[status]
}

export const VOCABULARY_WORD_TYPE_LABELS: Record<VocabularyWordType, string> = {
  Native: 'Thuần Nhật',
  SinoJapanese: 'Hán-Nhật',
  Loanword: 'Ngoại lai',
}

function isVocabularyWordType(value: string): value is VocabularyWordType {
  return (VOCABULARY_WORD_TYPE_OPTIONS as readonly string[]).includes(value)
}

export function getVocabularyWordTypeLabel(wordType: string) {
  return isVocabularyWordType(wordType) ? VOCABULARY_WORD_TYPE_LABELS[wordType] : wordType
}

export interface VocabularyAdminItem {
  id: string
  title: string
  summary: string
  level: VocabularyLevel | null
  tags: string[]
  status: VocabularyStatus
  createdAt: string
  updatedAt: string | null
  writing: string
  reading: string | null
  wordType: string | null
  audioUrl?: string | null
  speakerId: number | null
}

export interface VocabularyAdminDetail extends VocabularyAdminItem {
  pitchPattern: number[] | null
  meanings: VocabularyMeaningInput[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
  sentences: VocabularySentenceUpsertInput[]
}

export interface VocabularyMeaningInput {
  partOfSpeech: string
  definitions: string[]
}

export interface VocabularyUpsertPayload {
  title: string
  summary: string
  level: VocabularyLevel | null
  tags: string[]
  status: VocabularyStatus | null
  writing: string
  reading: string | null
  pitchPattern: number[] | null
  speakerId?: number | null
  wordType: string | null
  meanings: VocabularyMeaningInput[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
  sentences?: VocabularySentenceUpsertInput[]
}

export interface VocabularySentenceUpsertInput {
  id?: string
  text: string
  meaning: string
  speakerId?: number | null
  level: VocabularyLevel | null
}

export interface VocabularySearchQuery {
  q?: string
  level?: VocabularyLevel
  status?: VocabularyStatus
  wordType?: string
  createdByMe?: boolean
  hasAudio?: boolean
  page: number
  pageSize: number
}

export interface VocabularyImportSentenceItem {
  text: string
  meaning: string
  speakerId?: number | null
  level: VocabularyLevel | null
}

export interface VocabularyImportItem {
  rowNumber: number | null
  title: string
  summary: string
  level: VocabularyLevel | null
  tags: string[]
  status: VocabularyStatus | null
  writing: string
  reading: string | null
  pitchPattern: number[] | null
  speakerId?: number | null
  wordType: string | null
  meanings: VocabularyMeaningInput[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
  sentences: VocabularyImportSentenceItem[]
}

export interface VocabularyImportPayload {
  items: VocabularyImportItem[]
}

export interface VocabularyImportPreviewItem {
  rowNumber: number | null
  title: string
  writing: string
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface VocabularyImportPreviewResult {
  totalItems: number
  validItems: number
  invalidItems: number
  items: VocabularyImportPreviewItem[]
}

export interface VocabularyImportCommitItem {
  rowNumber: number | null
  title: string
  writing: string
  isSuccess: boolean
  action: string
  cardId?: string
  errors: string[]
}

export interface VocabularyImportCommitResult {
  totalItems: number
  successfulItems: number
  failedItems: number
  hasValidationErrors: boolean
  items: VocabularyImportCommitItem[]
}
