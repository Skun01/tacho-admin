import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AddCardToFolderPayload,
  AdminDeckDetailResponse,
  AdminDeckListItemResponse,
  AdminDeckListResult,
  AdminDeckSearchQuery,
  CreateAdminDeckPayload,
  CreateDeckFolderPayload,
  DeckFolderCardItemResponse,
  DeckFolderResponse,
  ReorderFolderCardsPayload,
  ReorderFoldersPayload,
  UpdateAdminDeckPayload,
  UpdateDeckFolderPayload,
} from '@/types/deckAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function mapDeckListResponse(response: PaginatedResponse<AdminDeckListItemResponse>): AdminDeckListResult {
  return {
    items: response.data ?? [],
    meta: response.metaData ?? null,
  }
}

export const deckAdminService = {
  async getDecks(query: AdminDeckSearchQuery): Promise<AdminDeckListResult> {
    const response = await api.get<PaginatedResponse<AdminDeckListItemResponse>>('/admin/decks', {
      params: omitNullishValues({
        q: query.q,
        typeId: query.typeId,
        createdBy: query.createdBy,
        status: query.status,
        visibility: query.visibility,
        isOfficial: query.isOfficial,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
    return mapDeckListResponse(response.data)
  },

  async getDeckDetail(deckId: string): Promise<AdminDeckDetailResponse> {
    const response = await api.get<ApiResponse<AdminDeckDetailResponse>>(`/admin/decks/${deckId}`)
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async createDeck(payload: CreateAdminDeckPayload): Promise<AdminDeckDetailResponse> {
    const response = await api.post<ApiResponse<AdminDeckDetailResponse>>('/admin/decks', payload)
    if (!response.data.data) {
      throw new Error('Common_400')
    }
    return response.data.data
  },

  async updateDeck(deckId: string, payload: UpdateAdminDeckPayload): Promise<AdminDeckDetailResponse> {
    const response = await api.patch<ApiResponse<AdminDeckDetailResponse>>(`/admin/decks/${deckId}`, payload)
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async deleteDeck(deckId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/decks/${deckId}`)
    return response.data.data === true
  },

  async publishDeck(deckId: string): Promise<AdminDeckDetailResponse> {
    const response = await api.post<ApiResponse<AdminDeckDetailResponse>>(`/admin/decks/${deckId}/publish`, {})
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async archiveDeck(deckId: string): Promise<AdminDeckDetailResponse> {
    const response = await api.post<ApiResponse<AdminDeckDetailResponse>>(`/admin/decks/${deckId}/archive`, {})
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async unpublishDeck(deckId: string): Promise<AdminDeckDetailResponse> {
    const response = await api.post<ApiResponse<AdminDeckDetailResponse>>(`/admin/decks/${deckId}/unpublish`, {})
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async createFolder(deckId: string, payload: CreateDeckFolderPayload): Promise<DeckFolderResponse> {
    const response = await api.post<ApiResponse<DeckFolderResponse>>(`/admin/decks/${deckId}/folders`, payload)
    if (!response.data.data) {
      throw new Error('Common_400')
    }
    return response.data.data
  },

  async reorderFolders(deckId: string, payload: ReorderFoldersPayload): Promise<DeckFolderResponse[]> {
    const response = await api.put<ApiResponse<DeckFolderResponse[]>>(`/admin/decks/${deckId}/folders/order`, payload)
    return response.data.data ?? []
  },

  async updateFolder(folderId: string, payload: UpdateDeckFolderPayload): Promise<DeckFolderResponse> {
    const response = await api.patch<ApiResponse<DeckFolderResponse>>(`/admin/folders/${folderId}`, payload)
    if (!response.data.data) {
      throw new Error('Deck_FolderNotFound_404')
    }
    return response.data.data
  },

  async deleteFolder(folderId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/folders/${folderId}`)
    return response.data.data === true
  },

  async addCardToFolder(folderId: string, payload: AddCardToFolderPayload): Promise<DeckFolderResponse> {
    const response = await api.post<ApiResponse<DeckFolderResponse>>(`/admin/folders/${folderId}/cards`, payload)
    if (!response.data.data) {
      throw new Error('Deck_CardNotFound_404')
    }
    return response.data.data
  },

  async removeCardFromFolder(folderId: string, cardId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/admin/folders/${folderId}/cards/${cardId}`)
    return response.data.data === true
  },

  async reorderFolderCards(folderId: string, payload: ReorderFolderCardsPayload): Promise<DeckFolderCardItemResponse[]> {
    const response = await api.put<ApiResponse<DeckFolderCardItemResponse[]>>(`/admin/folders/${folderId}/cards/order`, payload)
    return response.data.data ?? []
  },
}
