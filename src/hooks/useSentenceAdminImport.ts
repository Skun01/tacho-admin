import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { sentenceAdminService } from '@/services/sentenceAdminService'
import type { SentenceImportPayload } from '@/types/sentenceAdmin'

export function useSentenceAdminImport() {
  const queryClient = useQueryClient()

  const previewMutation = useMutation({
    mutationFn: (payload: SentenceImportPayload) => sentenceAdminService.importPreview(payload),
  })

  const commitMutation = useMutation({
    mutationFn: (payload: SentenceImportPayload) => sentenceAdminService.importCommit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'sentences'] })
    },
  })

  return {
    previewMutation,
    commitMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
