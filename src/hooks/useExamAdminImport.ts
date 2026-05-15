import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { examAdminService } from '@/services/examAdminService'
import { JLPT_ADMIN_QUERY_KEYS } from '@/hooks/useJlptAdminQueries'
import type { ImportExamRequest } from '@/types/jlptAdmin'

export function useExamAdminImport() {
  const queryClient = useQueryClient()

  const previewMutation = useMutation({
    mutationFn: (payload: ImportExamRequest) => examAdminService.importPreview(payload),
  })

  const commitMutation = useMutation({
    mutationFn: (payload: ImportExamRequest) => examAdminService.importCommit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JLPT_ADMIN_QUERY_KEYS.all })
    },
  })

  return {
    previewMutation,
    commitMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}