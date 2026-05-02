import { format } from 'date-fns'
import { ArrowLeftIcon, EnvelopeSimpleIcon, ShieldCheckIcon, ShieldSlashIcon, SpinnerGapIcon, UserCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ADMIN_USER_CONTENT } from '@/constants/adminUser'
import type { AdminUserDetail } from '@/types/adminUser'
import { getAdminUserRoleLabel, getAdminUserStatusLabel } from '@/types/adminUser'

interface UserDetailDrawerProps {
  user: AdminUserDetail | null
  isLoading: boolean
  isChangingRole: boolean
  isTogglingStatus: boolean
  isTogglingVerification: boolean
  isSendingResetPassword: boolean
  onClose: () => void
  onChangeRole: (role: 'user' | 'editor' | 'admin') => void
  onToggleStatus: () => void
  onToggleVerification: () => void
  onSendResetPassword: () => void
}

export function UserDetailDrawer({
  user,
  isLoading,
  isChangingRole,
  isTogglingStatus,
  isTogglingVerification,
  isSendingResetPassword,
  onClose,
  onChangeRole,
  onToggleStatus,
  onToggleVerification,
  onSendResetPassword,
}: UserDetailDrawerProps) {
  if (!user && !isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto"
        style={{ backgroundColor: 'var(--surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)' }}
      >
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-lg font-semibold">
            {ADMIN_USER_CONTENT.actions.viewDetail}
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeftIcon size={20} />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-60" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : user ? (
            <>
              {/* User identity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{ADMIN_USER_CONTENT.columns.user}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCircleIcon size={40} style={{ color: 'var(--on-surface-variant)' }} />
                    <div>
                      <p className="text-lg font-semibold">{user.displayName || ADMIN_USER_CONTENT.columns.displayName}</p>
                      <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                        <EnvelopeSimpleIcon size={14} />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.columns.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{getAdminUserRoleLabel(user.role)}</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.columns.status}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={user.isActive ? 'default' : 'secondary'} className={!user.isActive ? 'opacity-70' : undefined}>
                      {getAdminUserStatusLabel(user.isActive)}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.columns.verified}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.isVerified ? (
                      <div className="flex items-center gap-1">
                        <ShieldCheckIcon size={16} style={{ color: 'var(--color-green)' }} />
                        <span className="text-sm">{ADMIN_USER_CONTENT.isVerifiedLabel}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ShieldSlashIcon size={16} style={{ color: 'var(--on-surface-variant)' }} />
                        <span className="text-sm">{ADMIN_USER_CONTENT.isNotVerifiedLabel}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.columns.createdAt}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>
                  Thao tác
                </p>

                {/* Change role */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.dialogs.changeRole.newRoleLabel}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {ADMIN_USER_CONTENT.dialogs.changeRole.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(['user', 'editor', 'admin'] as const).map((role) => (
                        <Button
                          key={role}
                          type="button"
                          size="sm"
                          variant={user.role === role ? 'default' : 'outline'}
                          onClick={() => onChangeRole(role)}
                          disabled={isChangingRole || user.role === role}
                        >
                          {isChangingRole && user.role !== role ? (
                            <SpinnerGapIcon size={14} className="animate-spin" />
                          ) : null}
                          {getAdminUserRoleLabel(role)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Toggle status */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.actions.toggleStatus}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      variant={user.isActive ? 'secondary' : 'default'}
                      className="w-full"
                      onClick={onToggleStatus}
                      disabled={isTogglingStatus}
                    >
                      {isTogglingStatus && <SpinnerGapIcon size={16} className="animate-spin" />}
                      {user.isActive
                        ? ADMIN_USER_CONTENT.dialogs.changeStatus.deactivate.confirmLabel
                        : ADMIN_USER_CONTENT.dialogs.changeStatus.activate.confirmLabel}
                    </Button>
                  </CardContent>
                </Card>

                {/* Toggle verification */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.actions.toggleVerification}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={onToggleVerification}
                      disabled={isTogglingVerification}
                    >
                      {isTogglingVerification && <SpinnerGapIcon size={16} className="animate-spin" />}
                      {user.isVerified
                        ? ADMIN_USER_CONTENT.dialogs.changeVerification.unverify.confirmLabel
                        : ADMIN_USER_CONTENT.dialogs.changeVerification.verify.confirmLabel}
                    </Button>
                  </CardContent>
                </Card>

                {/* Send reset password */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">{ADMIN_USER_CONTENT.actions.sendResetPassword}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                      {ADMIN_USER_CONTENT.dialogs.sendResetPassword.description}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={onSendResetPassword}
                      disabled={isSendingResetPassword}
                    >
                      {isSendingResetPassword && <SpinnerGapIcon size={16} className="animate-spin" />}
                      {ADMIN_USER_CONTENT.dialogs.sendResetPassword.confirmLabel}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}