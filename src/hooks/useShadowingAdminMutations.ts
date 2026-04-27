import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SHADOWING_ADMIN_ERROR_MESSAGES } from '@/constants/shadowingAdmin'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { shadowingAdminService } from '@/services/shadowingAdminService'
import { SHADOWING_ADMIN_QUERY_KEYS } from './useShadowingAdminQueries'
import type {
  AttachBulkShadowingSentenceRequest,
  AttachShadowingSentencePayload,
  CreateShadowingTopicPayload,
  ReorderTopicSentencesPayload,
  UpdateShadowingTopicPayload,
  UpdateTopicSentencePayload,
} from '@/types/shadowingAdmin'

export function useShadowingAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: SHADOWING_ADMIN_QUERY_KEYS.all })
  const invalidateDetail = (topicId: string) =>
    queryClient.invalidateQueries({ queryKey: SHADOWING_ADMIN_QUERY_KEYS.topicDetail(topicId) })
  const invalidateAvailableSentences = (topicId: string) =>
    queryClient.invalidateQueries({ queryKey: SHADOWING_ADMIN_QUERY_KEYS.availableSentences(topicId) })
  const invalidateAnalytics = (topicId: string) =>
    queryClient.invalidateQueries({ queryKey: SHADOWING_ADMIN_QUERY_KEYS.topicAnalytics(topicId) })

  // ── Topic Mutations ──────────────────────────────────────────────────────────

  const createTopicMutation = useMutation({
    mutationFn: (payload: CreateShadowingTopicPayload) => shadowingAdminService.createTopic(payload),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  const updateTopicMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: UpdateShadowingTopicPayload }) =>
      shadowingAdminService.updateTopic(topicId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateList(), invalidateDetail(variables.topicId)])
    },
  })

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => shadowingAdminService.deleteTopic(topicId),
    onSuccess: async () => {
      await invalidateList()
    },
  })

  // ── Sentence Management Mutations ───────────────────────────────────────────

  const attachSentenceMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: AttachShadowingSentencePayload }) =>
      shadowingAdminService.attachSentence(topicId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        invalidateList(),
        invalidateDetail(variables.topicId),
        invalidateAvailableSentences(variables.topicId),
        invalidateAnalytics(variables.topicId),
      ])
    },
  })

  const attachBulkSentencesMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: AttachBulkShadowingSentenceRequest }) =>
      shadowingAdminService.attachBulkSentences(topicId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        invalidateList(),
        invalidateDetail(variables.topicId),
        invalidateAvailableSentences(variables.topicId),
        invalidateAnalytics(variables.topicId),
      ])
    },
  })

  const updateTopicSentenceMutation = useMutation({
    mutationFn: ({
      topicId,
      sentenceId,
      payload,
    }: {
      topicId: string
      sentenceId: string
      payload: UpdateTopicSentencePayload
    }) => shadowingAdminService.updateTopicSentence(topicId, sentenceId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateDetail(variables.topicId)
    },
  })

  const removeSentenceMutation = useMutation({
    mutationFn: ({ topicId, sentenceId }: { topicId: string; sentenceId: string }) =>
      shadowingAdminService.removeSentence(topicId, sentenceId),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        invalidateList(),
        invalidateDetail(variables.topicId),
        invalidateAvailableSentences(variables.topicId),
        invalidateAnalytics(variables.topicId),
      ])
    },
  })

  const reorderSentencesMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: ReorderTopicSentencesPayload }) =>
      shadowingAdminService.reorderSentences(topicId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateDetail(variables.topicId)
    },
  })

  return {
    createTopicMutation,
    updateTopicMutation,
    deleteTopicMutation,
    attachSentenceMutation,
    attachBulkSentencesMutation,
    updateTopicSentenceMutation,
    removeSentenceMutation,
    reorderSentencesMutation,
    getApiErrorMessage: (error: unknown, fallback: string) =>
      getSafeApiErrorMessage(error, fallback, SHADOWING_ADMIN_ERROR_MESSAGES),
  }
}
