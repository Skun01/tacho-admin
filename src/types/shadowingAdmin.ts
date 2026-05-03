// Shadowing Admin Types for learning-admin
// API Endpoints: /api/admin/shadowing/*

// ── Re-export shared types from API guide ───────────────────────────────────

export type ShadowingLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export type ShadowingVisibility = 'Public' | 'Private'

export type ShadowingStatus = 'Draft' | 'Published' | 'Archived'

// ── Request Types ───────────────────────────────────────────────────────────

export interface SearchShadowingTopicsQuery {
  q?: string
  level?: ShadowingLevel
  visibility?: ShadowingVisibility
  status?: ShadowingStatus
  isOfficial?: boolean
  createdBy?: string
  page?: number
  pageSize?: number
}

export interface CreateShadowingTopicPayload {
  title: string
  description: string
  coverImageUrl?: string
  level?: ShadowingLevel
  visibility?: ShadowingVisibility
  status?: ShadowingStatus
}

export interface UpdateShadowingTopicPayload {
  title?: string
  description?: string
  coverImageUrl?: string
  level?: ShadowingLevel
  visibility?: ShadowingVisibility
  status?: ShadowingStatus
}

export interface AttachShadowingSentencePayload {
  sentenceId: string
  position: number
  note?: string
}

export interface AttachBulkShadowingSentenceRequest {
  items: AttachShadowingSentencePayload[]
}

export interface UpdateTopicSentencePayload {
  position: number
  note?: string
}

export interface ReorderTopicSentenceItem {
  sentenceId: string
  position: number
}

export interface ReorderTopicSentencesPayload {
  items: ReorderTopicSentenceItem[]
}

export interface SearchAvailableSentencesQuery {
  q?: string
  level?: ShadowingLevel
  hasAudio?: boolean
  page?: number
  pageSize?: number
}

// ── Response Types ───────────────────────────────────────────────────────────

export interface ShadowingTopicListItemResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  level: ShadowingLevel | null
  visibility: ShadowingVisibility
  status: ShadowingStatus
  isOfficial: boolean
  sentencesCount: number
  isOwner: boolean
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string | null
}

export interface ShadowingTopicSentenceResponse {
  sentenceId: string
  position: number
  text: string
  meaning: string
  audioUrl: string | null
  level: ShadowingLevel | null
  note: string | null
}

export interface ShadowingTopicDetailResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  level: ShadowingLevel | null
  visibility: ShadowingVisibility
  status: ShadowingStatus
  isOfficial: boolean
  sentencesCount: number
  isOwner: boolean
  creatorId: string
  creatorName: string
  sentences: ShadowingTopicSentenceResponse[]
  createdAt: string
  updatedAt: string | null
}

export interface AvailableSentenceResponse {
  sentenceId: string
  text: string
  meaning: string
  audioUrl: string | null
  level: ShadowingLevel | null
  isAttached: boolean
  attachedPosition: number | null
  attachedNote: string | null
}

export interface ShadowingTopicAnalyticsResponse {
  topicId: string
  attemptsCount: number
  distinctUsersCount: number
  averagePronScore: number | null
  latestAttemptAt: string | null
}

export interface ShadowingSentenceAnalyticsResponse {
  sentenceId: string
  position: number
  text: string
  attemptsCount: number
  distinctUsersCount: number
  averagePronScore: number | null
  latestAttemptAt: string | null
}

// ── List Result Types ───────────────────────────────────────────────────────

export interface ShadowingTopicListResult {
  items: ShadowingTopicListItemResponse[]
  meta: PaginatedMeta | null
}

export interface AvailableSentenceListResult {
  items: AvailableSentenceResponse[]
  meta: PaginatedMeta | null
}

export interface PaginatedMeta {
  total: number
  page: number
  pageSize: number
}
