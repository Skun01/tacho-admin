import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSafeApiErrorMessage } from '@/lib/apiError'
import { adminUserService } from '@/services/adminUserService'
import type {
  AdminUserChangeRolePayload,
  AdminUserChangeStatusPayload,
  AdminUserChangeVerificationPayload,
} from '@/types/adminUser'

export function useAdminUserMutations() {
  const queryClient = useQueryClient()

  const onSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  }

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUserChangeRolePayload }) =>
      adminUserService.changeRole(id, payload),
    onSuccess,
  })

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUserChangeStatusPayload }) =>
      adminUserService.changeStatus(id, payload),
    onSuccess,
  })

  const changeVerificationMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminUserChangeVerificationPayload }) =>
      adminUserService.changeVerification(id, payload),
    onSuccess,
  })

  const sendResetPasswordMutation = useMutation({
    mutationFn: (id: string) => adminUserService.sendResetPassword(id),
  })

  return {
    changeRoleMutation,
    changeStatusMutation,
    changeVerificationMutation,
    sendResetPasswordMutation,
    getApiErrorMessage: getSafeApiErrorMessage,
  }
}