export const SENTENCE_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export type SentenceLevel = (typeof SENTENCE_LEVEL_OPTIONS)[number]

export interface SentenceAdminItem {
  id: string
  text: string
  meaning: string
  audioUrl: string | null
  level: SentenceLevel | null
  createdAt: string
  updatedAt: string | null
}

export interface SentenceSearchQuery {
  q?: string
  level?: SentenceLevel
  page: number
  pageSize: number
}

export interface SentenceUpsertPayload {
  text: string
  meaning: string
  audioUrl: string | null
  level: SentenceLevel | null
}
