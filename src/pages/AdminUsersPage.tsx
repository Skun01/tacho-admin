import { Helmet } from '@dr.pogodin/react-helmet'
import { AdminUserFilters } from '@/components/user/AdminUserFilters'
import { AdminUserTable } from '@/components/user/AdminUserTable'
import { UserDetailDrawer } from '@/components/user/UserDetailDrawer'
import { UserToggleStatusDialog } from '@/components/user/UserToggleStatusDialog'
import { UserToggleVerificationDialog } from '@/components/user/UserToggleVerificationDialog'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import { useAdminUserDetailState } from '@/hooks/useAdminUserPageState'
import { useAdminUserPageState } from '@/hooks/useAdminUserPageState'

export function AdminUsersPage() {
  const state = useAdminUserPageState()
  const detailState = useAdminUserDetailState(state.selectedUser?.id ?? null)

  return (
    <>
      <Helmet>
        <title>{ADMIN_USER_CONTENT.pageTitle}</title>
      </Helmet>

      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--on-surface)' }}>
            {ADMIN_USER_CONTENT.heading}
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {ADMIN_USER_CONTENT.description}
          </p>
        </div>

        <AdminUserFilters
          keywordInput={state.keywordInput}
          roleInput={state.roleInput}
          isActiveInput={state.isActiveInput}
          isVerifiedInput={state.isVerifiedInput}
          totalItems={state.totalItems}
          onKeywordInputChange={state.setKeywordInput}
          onRoleToggle={(role) => state.setRoleInput((prev) => (prev === role ? undefined : role))}
          onIsActiveToggle={state.setIsActiveInput}
          onIsVerifiedToggle={state.setIsVerifiedInput}
          onSearch={state.handleSearch}
          onReset={state.handleReset}
        />

        <AdminUserTable
          items={state.items}
          isLoading={state.isLoading}
          isFetching={state.isFetching}
          currentPage={state.currentPage ?? 1}
          totalPage={state.totalPage > 0 ? state.totalPage : 1}
          isTogglingStatus={state.isTogglingStatus}
          isTogglingVerification={state.isTogglingVerification}
          onPageChange={state.handlePageChange}
          onToggleStatus={(item) => state.setPendingToggleStatusItem(item)}
          onToggleVerification={(item) => state.setPendingToggleVerifyItem(item)}
          onOpenDetail={state.setSelectedUser}
        />
      </section>

      {/* Toggle status confirm dialog */}
      <UserToggleStatusDialog
        open={Boolean(state.pendingToggleStatusItem)}
        item={state.pendingToggleStatusItem}
        isPending={state.isTogglingStatus}
        onOpenChange={(open) => {
          if (!open) state.setPendingToggleStatusItem(null)
        }}
        onConfirm={state.handleConfirmToggleStatus}
      />

      {/* Toggle verification confirm dialog */}
      <UserToggleVerificationDialog
        open={Boolean(state.pendingToggleVerifyItem)}
        item={state.pendingToggleVerifyItem}
        isPending={state.isTogglingVerification}
        onOpenChange={(open) => {
          if (!open) state.setPendingToggleVerifyItem(null)
        }}
        onConfirm={state.handleConfirmToggleVerification}
      />

      {/* User detail drawer */}
      <UserDetailDrawer
        user={detailState.user}
        isLoading={detailState.isLoading}
        isChangingRole={detailState.isChangingRole}
        isTogglingStatus={detailState.isTogglingStatus}
        isTogglingVerification={detailState.isTogglingVerification}
        isSendingResetPassword={detailState.isSendingResetPassword}
        onClose={state.setSelectedUser.bind(null, null)}
        onChangeRole={detailState.handleChangeRole}
        onToggleStatus={detailState.handleToggleStatus}
        onToggleVerification={detailState.handleToggleVerification}
        onSendResetPassword={detailState.handleSendResetPassword}
      />
    </>
  )
}