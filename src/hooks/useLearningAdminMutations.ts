import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { learningAdminService } from '@/services/learningAdminService'
import type {
  AttachSentencePayload,
  ReorderSentencesPayload,
  UpdateCardConfigPayload,
  UpdateSentenceRelationPayload,
} from '@/types/learningAdmin'

export function useLearningAdminMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'learning'] })
  }

  const updateCardConfigMutation = useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: UpdateCardConfigPayload }) =>
      learningAdminService.updateCardConfig(cardId, payload),
    onSuccess,
  })

  const attachSentenceMutation = useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: AttachSentencePayload }) =>
      learningAdminService.attachSentence(cardId, payload),
    onSuccess,
  })

  const updateSentenceRelationMutation = useMutation({
    mutationFn: ({
      cardId,
      sentenceId,
      payload,
    }: {
      cardId: string
      sentenceId: string
      payload: UpdateSentenceRelationPayload
    }) => learningAdminService.updateSentenceRelation(cardId, sentenceId, payload),
    onSuccess,
  })

  const removeSentenceRelationMutation = useMutation({
    mutationFn: ({ cardId, sentenceId }: { cardId: string; sentenceId: string }) =>
      learningAdminService.removeSentenceRelation(cardId, sentenceId),
    onSuccess,
  })

  const reorderSentencesMutation = useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: ReorderSentencesPayload }) =>
      learningAdminService.reorderSentences(cardId, payload),
    onSuccess,
  })

  return {
    updateCardConfigMutation,
    attachSentenceMutation,
    updateSentenceRelationMutation,
    removeSentenceRelationMutation,
    reorderSentencesMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
