import { useMutation, useQueryClient } from '@tanstack/react-query'
import { JLPT_ADMIN_ERROR_MESSAGES } from '@/constants/jlptAdmin'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { jlptExamAdminService } from '@/services/jlptExamAdminService'
import { jlptQuestionAdminService } from '@/services/jlptQuestionAdminService'
import { jlptAiQuestionAdminService } from '@/services/jlptAiQuestionAdminService'
import { JLPT_ADMIN_QUERY_KEYS } from './useJlptAdminQueries'
import type {
  BulkCreateQuestionsPayload,
  CreateExamPayload,
  CreateQuestionGroupPayload,
  CreateQuestionPayload,
  CreateSectionPayload,
  GenerateAiQuestionsPayload,
  ReorderQuestionsPayload,
  UpdateAiQuestionPayload,
  UpdateExamPayload,
  UpdateQuestionGroupPayload,
  UpdateQuestionPayload,
  UpdateSectionPayload,
} from '@/types/jlptAdmin'

export function useJlptAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateExamList = () => queryClient.invalidateQueries({ queryKey: JLPT_ADMIN_QUERY_KEYS.all })
  const invalidateExamDetail = (id: string) =>
    queryClient.invalidateQueries({ queryKey: JLPT_ADMIN_QUERY_KEYS.examDetail(id) })

  // ── Exam Mutations ──────────────────────────────────────────────────────────

  const createExamMutation = useMutation({
    mutationFn: (payload: CreateExamPayload) => jlptExamAdminService.createExam(payload),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  const updateExamMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExamPayload }) =>
      jlptExamAdminService.updateExam(id, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([invalidateExamList(), invalidateExamDetail(variables.id)])
    },
  })

  const publishExamMutation = useMutation({
    mutationFn: (id: string) => jlptExamAdminService.publishExam(id),
    onSuccess: async (_result, id) => {
      await Promise.all([invalidateExamList(), invalidateExamDetail(id)])
    },
  })

  const deleteExamMutation = useMutation({
    mutationFn: (id: string) => jlptExamAdminService.deleteExam(id),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  // ── Section Mutations ───────────────────────────────────────────────────────

  const createSectionMutation = useMutation({
    mutationFn: ({ examId, payload }: { examId: string; payload: CreateSectionPayload }) =>
      jlptExamAdminService.createSection(examId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const updateSectionMutation = useMutation({
    mutationFn: ({ examId, sectionId, payload }: { examId: string; sectionId: string; payload: UpdateSectionPayload }) =>
      jlptExamAdminService.updateSection(examId, sectionId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const deleteSectionMutation = useMutation({
    mutationFn: ({ examId, sectionId }: { examId: string; sectionId: string }) =>
      jlptExamAdminService.deleteSection(examId, sectionId),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  // ── Question Group Mutations ────────────────────────────────────────────────

  const createGroupMutation = useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: string; payload: CreateQuestionGroupPayload; examId: string }) =>
      jlptExamAdminService.createGroup(sectionId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const updateGroupMutation = useMutation({
    mutationFn: ({ sectionId, groupId, payload }: { sectionId: string; groupId: string; payload: UpdateQuestionGroupPayload; examId: string }) =>
      jlptExamAdminService.updateGroup(sectionId, groupId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const deleteGroupMutation = useMutation({
    mutationFn: ({ sectionId, groupId }: { sectionId: string; groupId: string; examId: string }) =>
      jlptExamAdminService.deleteGroup(sectionId, groupId),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const generateGroupAudioMutation = useMutation({
    mutationFn: ({ groupId }: { groupId: string; examId: string }) =>
      jlptExamAdminService.generateGroupAudio(groupId),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  // ── Question Mutations ──────────────────────────────────────────────────────

  const createQuestionMutation = useMutation({
    mutationFn: ({ payload }: { payload: CreateQuestionPayload; examId: string }) =>
      jlptQuestionAdminService.createQuestion(payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuestionPayload; examId: string }) =>
      jlptQuestionAdminService.updateQuestion(id, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: ({ id }: { id: string; examId: string }) =>
      jlptQuestionAdminService.deleteQuestion(id),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const bulkCreateQuestionsMutation = useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: BulkCreateQuestionsPayload; examId: string }) =>
      jlptQuestionAdminService.bulkCreateQuestions(groupId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  const reorderQuestionsMutation = useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: ReorderQuestionsPayload; examId: string }) =>
      jlptQuestionAdminService.reorderQuestions(groupId, payload),
    onSuccess: async (_result, variables) => {
      await invalidateExamDetail(variables.examId)
    },
  })

  // ── AI Question Mutations ───────────────────────────────────────────────────

  const generateAiQuestionsMutation = useMutation({
    mutationFn: (payload: GenerateAiQuestionsPayload) =>
      jlptAiQuestionAdminService.generate(payload),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  const updateAiQuestionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAiQuestionPayload }) =>
      jlptAiQuestionAdminService.updateAiQuestion(id, payload),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  const approveAiQuestionMutation = useMutation({
    mutationFn: (id: string) => jlptAiQuestionAdminService.approveAiQuestion(id),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  const rejectAiQuestionMutation = useMutation({
    mutationFn: (id: string) => jlptAiQuestionAdminService.rejectAiQuestion(id),
    onSuccess: async () => {
      await invalidateExamList()
    },
  })

  return {
    createExamMutation,
    updateExamMutation,
    publishExamMutation,
    deleteExamMutation,
    createSectionMutation,
    updateSectionMutation,
    deleteSectionMutation,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    generateGroupAudioMutation,
    createQuestionMutation,
    updateQuestionMutation,
    deleteQuestionMutation,
    bulkCreateQuestionsMutation,
    reorderQuestionsMutation,
    generateAiQuestionsMutation,
    updateAiQuestionMutation,
    approveAiQuestionMutation,
    rejectAiQuestionMutation,
    getApiErrorMessage: (error: unknown, fallback: string) =>
      getSafeApiErrorMessage(error, fallback, JLPT_ADMIN_ERROR_MESSAGES),
  }
}
