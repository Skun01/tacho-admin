import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { vocabularyAdminService } from '@/services/vocabularyAdminService'
import type { VocabularyImportPayload } from '@/types/vocabularyAdmin'

export function useVocabularyAdminImport() {
  const queryClient = useQueryClient()

  const previewMutation = useMutation({
    mutationFn: (payload: VocabularyImportPayload) => vocabularyAdminService.importPreview(payload),
  })

  const commitMutation = useMutation({
    mutationFn: (payload: VocabularyImportPayload) => vocabularyAdminService.importCommit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'vocabulary'] })
    },
  })

  return {
    previewMutation,
    commitMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
