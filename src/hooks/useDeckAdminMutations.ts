import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DECK_ADMIN_ERROR_MESSAGES } from '@/constants/adminDeck'
import { DECK_ADMIN_QUERY_KEYS } from '@/hooks/useDeckAdminList'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { deckAdminService } from '@/services/deckAdminService'
import type {
  AddCardToFolderPayload,
  CreateAdminDeckPayload,
  CreateDeckFolderPayload,
  ReorderFolderCardsPayload,
  ReorderFoldersPayload,
  UpdateAdminDeckPayload,
  UpdateDeckFolderPayload,
} from '@/types/deckAdmin'

export function useDeckAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: DECK_ADMIN_QUERY_KEYS.all })
  const invalidateDetail = (deckId: string) =>
    queryClient.invalidateQueries({ queryKey: DECK_ADMIN_QUERY_KEYS.detail(deckId) })

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminDeckPayload) => deckAdminService.createDeck(payload),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ deckId, payload }: { deckId: string; payload: UpdateAdminDeckPayload }) =>
      deckAdminService.updateDeck(deckId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (deckId: string) => deckAdminService.deleteDeck(deckId),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  const publishMutation = useMutation({
    mutationFn: (deckId: string) => deckAdminService.publishDeck(deckId),
    onSuccess: async (_result, deckId) => {
      await Promise.all([invalidateList(), invalidateDetail(deckId)])
    },
  })

  const archiveMutation = useMutation({
    mutationFn: (deckId: string) => deckAdminService.archiveDeck(deckId),
    onSuccess: async (_result, deckId) => {
      await Promise.all([invalidateList(), invalidateDetail(deckId)])
    },
  })

  const unpublishMutation = useMutation({
    mutationFn: (deckId: string) => deckAdminService.unpublishDeck(deckId),
    onSuccess: async (_result, deckId) => {
      await Promise.all([invalidateList(), invalidateDetail(deckId)])
    },
  })

  const createFolderMutation = useMutation({
    mutationFn: ({ deckId, payload }: { deckId: string; payload: CreateDeckFolderPayload }) =>
      deckAdminService.createFolder(deckId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const reorderFoldersMutation = useMutation({
    mutationFn: ({ deckId, payload }: { deckId: string; payload: ReorderFoldersPayload }) =>
      deckAdminService.reorderFolders(deckId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const updateFolderMutation = useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      deckId: string
      folderId: string
      payload: UpdateDeckFolderPayload
    }) => deckAdminService.updateFolder(folderId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const deleteFolderMutation = useMutation({
    mutationFn: ({ folderId }: { deckId: string; folderId: string }) =>
      deckAdminService.deleteFolder(folderId),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const addCardMutation = useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      deckId: string
      folderId: string
      payload: AddCardToFolderPayload
    }) => deckAdminService.addCardToFolder(folderId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const removeCardMutation = useMutation({
    mutationFn: ({ folderId, cardId }: { deckId: string; folderId: string; cardId: string }) =>
      deckAdminService.removeCardFromFolder(folderId, cardId),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  const reorderCardsMutation = useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      deckId: string
      folderId: string
      payload: ReorderFolderCardsPayload
    }) => deckAdminService.reorderFolderCards(folderId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.deckId)])
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    publishMutation,
    archiveMutation,
    unpublishMutation,
    createFolderMutation,
    reorderFoldersMutation,
    updateFolderMutation,
    deleteFolderMutation,
    addCardMutation,
    removeCardMutation,
    reorderCardsMutation,
    getApiErrorMessage: (error: unknown, fallback: string) =>
      getSafeApiErrorMessage(error, fallback, DECK_ADMIN_ERROR_MESSAGES),
  }
}
