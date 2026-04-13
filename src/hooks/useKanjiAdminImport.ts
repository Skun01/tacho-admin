import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { kanjiAdminService } from '@/services/kanjiAdminService'
import type { KanjiImportPayload } from '@/types/kanjiAdmin'

export function useKanjiAdminImport() {
  const queryClient = useQueryClient()

  const previewMutation = useMutation({
    mutationFn: (payload: KanjiImportPayload) => kanjiAdminService.importPreview(payload),
  })

  const commitMutation = useMutation({
    mutationFn: (payload: KanjiImportPayload) => kanjiAdminService.importCommit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'kanji'] })
    },
  })

  return {
    previewMutation,
    commitMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}
