import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { grammarAdminService } from '@/services/grammarAdminService'
import type { GrammarImportPayload } from '@/types/grammarAdmin'

export function useGrammarAdminImport() {
  const queryClient = useQueryClient()

  const previewMutation = useMutation({
    mutationFn: (payload: GrammarImportPayload) => grammarAdminService.importPreview(payload),
  })

  const commitMutation = useMutation({
    mutationFn: (payload: GrammarImportPayload) => grammarAdminService.importCommit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'grammar'] })
    },
  })

  return {
    previewMutation,
    commitMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
