export const VOCABULARY_LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const
export const VOCABULARY_STATUS_OPTIONS = ['Draft', 'Published', 'Archived'] as const

export type VocabularyLevel = (typeof VOCABULARY_LEVEL_OPTIONS)[number]
export type VocabularyStatus = (typeof VOCABULARY_STATUS_OPTIONS)[number]

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
}

export interface VocabularyAdminDetail extends VocabularyAdminItem {
  pitchPattern: number[] | null
  meanings: VocabularyMeaningInput[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
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
  audioUrl: string | null
  wordType: string | null
  meanings: VocabularyMeaningInput[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
}

export interface VocabularySearchQuery {
  q?: string
  level?: VocabularyLevel
  status?: VocabularyStatus
  createdByMe?: boolean
  page: number
  pageSize: number
}
