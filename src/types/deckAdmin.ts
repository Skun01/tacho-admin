import type { PaginatedMeta } from '@/types/api'

export type DeckVisibility = 'Public' | 'Private'
export type DeckStatus = 'Draft' | 'Published' | 'Archived'
export type DeckCardType = 'Vocab' | 'Grammar' | 'Kanji'

export interface DeckTypeSummary {
  id: string | null
  name: string | null
}

export interface DeckOwnerInfo {
  id: string
  username: string
  avatarUrl: string | null
}

export interface AdminDeckTypeResponse {
  id: string
  name: string
  createdAt: string
}

export interface AdminDeckSearchCardSummary {
  id: string
  cardType: DeckCardType
  title: string
  summary: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | null
  alternateForms: string[]
}

export interface DeckFolderCardItemResponse {
  cardId: string
  position: number
  addedAt: string
  card: AdminDeckSearchCardSummary
}

export interface DeckFolderResponse {
  id: string
  title: string
  description: string
  position: number
  cardsCount: number
  cards: DeckFolderCardItemResponse[]
}

export interface AdminDeckListItemResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  visibility: DeckVisibility
  status: DeckStatus
  isOfficial: boolean
  cardsCount: number
  foldersCount: number
  type: DeckTypeSummary
  createdBy: DeckOwnerInfo
  forkedFromId: string | null
  bookmarkCount: number
  createdAt: string
  updatedAt: string | null
}

export interface AdminDeckDetailResponse extends AdminDeckListItemResponse {
  folders: DeckFolderResponse[]
}

export interface AdminDeckSearchQuery {
  q?: string
  typeId?: string
  createdBy?: string
  status?: DeckStatus
  visibility?: DeckVisibility
  isOfficial?: boolean
  page?: number
  pageSize?: number
}

export interface AdminDeckTypeSearchQuery {
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminDeckSearchCardsQuery {
  q?: string
  cardType?: DeckCardType
  level?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  page?: number
  pageSize?: number
}

export interface CreateAdminDeckPayload {
  title: string
  description?: string
  coverImageUrl?: string | null
  visibility: DeckVisibility
  status: DeckStatus
  isOfficial: boolean
  typeId?: string | null
}

export interface UpdateAdminDeckPayload {
  title?: string
  description?: string
  coverImageUrl?: string | null
  visibility?: DeckVisibility
  status?: DeckStatus
  isOfficial?: boolean
  typeId?: string | null
}

export interface CreateDeckFolderPayload {
  title: string
  description?: string
  position?: number
}

export interface UpdateDeckFolderPayload {
  title?: string
  description?: string
}

export interface AddCardToFolderPayload {
  cardId: string
  position?: number
}

export interface ReorderFoldersPayload {
  items: Array<{
    folderId: string
    position: number
  }>
}

export interface ReorderFolderCardsPayload {
  items: Array<{
    cardId: string
    position: number
  }>
}

export interface DeckTypeUpsertPayload {
  name: string
}

export interface AdminDeckListResult {
  items: AdminDeckListItemResponse[]
  meta: PaginatedMeta | null
}

export interface AdminDeckTypeListResult {
  items: AdminDeckTypeResponse[]
  meta: PaginatedMeta | null
}

export const DECK_ADMIN_STATUS_OPTIONS: DeckStatus[] = ['Draft', 'Published', 'Archived']
export const DECK_ADMIN_VISIBILITY_OPTIONS: DeckVisibility[] = ['Public', 'Private']
export const DECK_ADMIN_CARD_TYPE_OPTIONS: DeckCardType[] = ['Vocab', 'Grammar', 'Kanji']
