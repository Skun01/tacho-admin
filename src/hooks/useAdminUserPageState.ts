import { useEffect, useState } from 'react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import { useAdminUserList, useAdminUserDetail } from '@/hooks/useAdminUserQueries'
import { useAdminUserMutations } from '@/hooks/useAdminUserMutations'
import type { AdminUserListItem, AdminUserRole, AdminUserSearchQuery } from '@/types/adminUser'

const PAGE_SIZE = 20

export function useAdminUserPageState() {
  const [keywordInput, setKeywordInput] = useState('')
  const [roleInput, setRoleInput] = useState<AdminUserRole | undefined>(undefined)
  const [isActiveInput, setIsActiveInput] = useState<boolean | undefined>(undefined)
  const [isVerifiedInput, setIsVerifiedInput] = useState<boolean | undefined>(undefined)
  const [pendingToggleStatusItem, setPendingToggleStatusItem] = useState<AdminUserListItem | null>(null)
  const [pendingToggleVerifyItem, setPendingToggleVerifyItem] = useState<AdminUserListItem | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null)
  const [query, setQuery] = useState<AdminUserSearchQuery>({ page: 1, pageSize: PAGE_SIZE })

  const { data, isLoading, isFetching, isError, error } = useAdminUserList(query)
  const {
    changeStatusMutation,
    changeVerificationMutation,
    getApiErrorMessage,
  } = useAdminUserMutations()

  useEffect(() => {
    if (!isError) return
    gooeyToast.error(getApiErrorMessage(error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [isError, error, getApiErrorMessage])

  const items = data?.data ?? []
  const meta = data?.metaData
  const totalItems = meta?.total ?? items.length
  const currentPage = meta?.page ?? query.page
  const totalPage = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1

  const handleSearch = () => {
    setQuery({
      q: keywordInput.trim() || undefined,
      role: roleInput,
      isActive: isActiveInput,
      isVerified: isVerifiedInput,
      page: 1,
      pageSize: PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setKeywordInput('')
    setRoleInput(undefined)
    setIsActiveInput(undefined)
    setIsVerifiedInput(undefined)
    setQuery({ page: 1, pageSize: PAGE_SIZE })
  }

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({ ...prev, page: nextPage }))
  }

  const handleConfirmToggleStatus = async () => {
    if (!pendingToggleStatusItem) return
    try {
      await changeStatusMutation.mutateAsync({
        id: pendingToggleStatusItem.id,
        payload: { isActive: !pendingToggleStatusItem.isActive },
      })
      gooeyToast.success(
        pendingToggleStatusItem.isActive
          ? ADMIN_USER_CONTENT.dialogs.changeStatus.successDeactivate
          : ADMIN_USER_CONTENT.dialogs.changeStatus.successActivate,
      )
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.toast.crudErrorFallback))
    } finally {
      setPendingToggleStatusItem(null)
    }
  }

  const handleConfirmToggleVerification = async () => {
    if (!pendingToggleVerifyItem) return
    try {
      await changeVerificationMutation.mutateAsync({
        id: pendingToggleVerifyItem.id,
        payload: { isVerified: !pendingToggleVerifyItem.isVerified },
      })
      gooeyToast.success(
        pendingToggleVerifyItem.isVerified
          ? ADMIN_USER_CONTENT.dialogs.changeVerification.successUnverify
          : ADMIN_USER_CONTENT.dialogs.changeVerification.successVerify,
      )
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.toast.crudErrorFallback))
    } finally {
      setPendingToggleVerifyItem(null)
    }
  }

  return {
    keywordInput,
    roleInput,
    isActiveInput,
    isVerifiedInput,
    isLoading,
    isFetching,
    isTogglingStatus: changeStatusMutation.isPending,
    isTogglingVerification: changeVerificationMutation.isPending,
    pendingToggleStatusItem,
    pendingToggleVerifyItem,
    selectedUser,
    setSelectedUser,
    items,
    totalItems,
    currentPage,
    totalPage,
    setKeywordInput,
    setRoleInput,
    setIsActiveInput,
    setIsVerifiedInput,
    setPendingToggleStatusItem,
    setPendingToggleVerifyItem,
    handleSearch,
    handleReset,
    handlePageChange,
    handleConfirmToggleStatus,
    handleConfirmToggleVerification,
  }
}

export function useAdminUserDetailState(userId: string | null) {
  const { data, isLoading, isFetching, isError, error } = useAdminUserDetail(userId)
  const {
    changeRoleMutation,
    changeStatusMutation,
    changeVerificationMutation,
    sendResetPasswordMutation,
    getApiErrorMessage,
  } = useAdminUserMutations()

  useEffect(() => {
    if (!isError) return
    gooeyToast.error(getApiErrorMessage(error, ADMIN_COMMON_CONTENT.apiErrorFallback))
  }, [isError, error, getApiErrorMessage])

  const handleChangeRole = async (role: AdminUserRole) => {
    if (!userId) return
    try {
      await changeRoleMutation.mutateAsync({ id: userId, payload: { role } })
      gooeyToast.success(ADMIN_USER_CONTENT.dialogs.changeRole.success)
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleToggleStatus = async () => {
    if (!data?.data) return
    const newStatus = !data.data.isActive
    try {
      await changeStatusMutation.mutateAsync({ id: userId!, payload: { isActive: newStatus } })
      gooeyToast.success(newStatus
        ? ADMIN_USER_CONTENT.dialogs.changeStatus.successActivate
        : ADMIN_USER_CONTENT.dialogs.changeStatus.successDeactivate)
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleToggleVerification = async () => {
    if (!data?.data) return
    const newVerified = !data.data.isVerified
    try {
      await changeVerificationMutation.mutateAsync({ id: userId!, payload: { isVerified: newVerified } })
      gooeyToast.success(newVerified
        ? ADMIN_USER_CONTENT.dialogs.changeVerification.successVerify
        : ADMIN_USER_CONTENT.dialogs.changeVerification.successUnverify)
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.toast.crudErrorFallback))
    }
  }

  const handleSendResetPassword = async () => {
    if (!userId) return
    try {
      await sendResetPasswordMutation.mutateAsync(userId)
      gooeyToast.success(ADMIN_USER_CONTENT.dialogs.sendResetPassword.success)
    } catch (err) {
      gooeyToast.error(getApiErrorMessage(err, ADMIN_USER_CONTENT.dialogs.sendResetPassword.failed))
    }
  }

  return {
    user: data?.data ?? null,
    isLoading,
    isFetching,
    isChangingRole: changeRoleMutation.isPending,
    isTogglingStatus: changeStatusMutation.isPending,
    isTogglingVerification: changeVerificationMutation.isPending,
    isSendingResetPassword: sendResetPasswordMutation.isPending,
    handleChangeRole,
    handleToggleStatus,
    handleToggleVerification,
    handleSendResetPassword,
  }
}