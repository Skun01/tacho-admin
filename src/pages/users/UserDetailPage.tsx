import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, ProhibitInset, CheckCircle } from '@phosphor-icons/react'
import { userService } from '@/services/userService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ROLE_LABELS } from '@/constants/navigation'
import type { AdminUserDetail } from '@/types/user'
import type { UserRole } from '@/types/auth'

const ROLE_CHIP: Record<UserRole, string> = {
  admin:  'bg-primary-container text-on-primary-container',
  editor: 'bg-secondary-container text-on-secondary-container',
  user:   'bg-surface-container-high text-outline',
}

export function UserDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser]     = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!id) return
    userService.getById(id)
      .then((r) => setUser(r.data.data))
      .catch(() => gooeyToast.error('Không tìm thấy người dùng'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const changeRole = async (role: UserRole) => {
    if (!user || role === user.role) return
    if (!confirm(`Đổi role thành ${ROLE_LABELS[role]}?`)) return
    try {
      await userService.updateRole(user.id, { role })
      gooeyToast.success('Đã cập nhật role')
      load()
    } catch { gooeyToast.error('Cập nhật role thất bại') }
  }

  const toggleBan = async () => {
    if (!user) return
    const action = user.isBanned ? 'Bỏ cấm' : 'Cấm'
    if (!confirm(`${action} người dùng này?`)) return
    try {
      await userService.setBan(user.id, { banned: !user.isBanned })
      gooeyToast.success(`Đã ${user.isBanned ? 'bỏ cấm' : 'cấm'} người dùng`)
      load()
    } catch { gooeyToast.error('Thao tác thất bại') }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[14px] text-outline">Đang tải...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <p className="text-[14px] text-tertiary">Không tìm thấy người dùng</p>
        <button onClick={() => navigate('/users')}
          className="rounded-xl bg-surface-container-low px-4 py-2 text-[13px] text-outline hover:bg-accent">
          Quay lại
        </button>
      </div>
    )
  }

  const STATS = [
    { label: 'Phiên học',       value: user.totalStudySessions },
    { label: 'Thẻ đã ôn',       value: user.totalCardsReviewed },
    { label: 'Bộ thẻ của mình', value: user.totalDecksOwned },
    { label: 'Bình luận',       value: user.totalComments },
  ]

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/users')}
        className="flex items-center gap-1.5 text-[13px] text-outline transition-colors hover:text-primary"
      >
        <ArrowLeft size={14} />
        Danh sách người dùng
      </button>

      {/* Profile card */}
      <section className="rounded-2xl bg-card p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-container-low text-xl font-bold text-primary">
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full rounded-2xl object-cover" />
              : user.displayName.charAt(0).toUpperCase()
            }
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user.displayName}
              </h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_CHIP[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
              {user.isBanned && (
                <span className="rounded-full bg-tertiary-container px-2.5 py-0.5 text-[11px] font-medium text-on-tertiary-container">
                  Bị cấm
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[13px] text-outline">{user.email}</p>
            {user.lastActiveAt && (
              <p className="mt-1 text-[12px] text-outline">
                Hoạt động lần cuối: {new Date(user.lastActiveAt).toLocaleString('vi-VN')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <select
              value={user.role}
              onChange={(e) => changeRole(e.target.value as UserRole)}
              className="rounded-xl border-0 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              {(['user', 'editor', 'admin'] as UserRole[]).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <button
              onClick={toggleBan}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                user.isBanned
                  ? 'bg-primary-container text-on-primary-container hover:opacity-80'
                  : 'bg-tertiary-container text-on-tertiary-container hover:opacity-80'
              }`}
            >
              {user.isBanned
                ? <><CheckCircle size={14} /> Bỏ cấm</>
                : <><ProhibitInset size={14} /> Cấm</>
              }
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-card px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-outline-variant">{label}</p>
            <p className="mt-1 text-2xl font-bold text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {value.toLocaleString('vi-VN')}
            </p>
          </div>
        ))}
      </section>

      {/* Account info */}
      <section className="rounded-2xl bg-card p-6">
        <h3 className="mb-4 text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Thông tin tài khoản
        </h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-8">
          {[
            { label: 'ID', value: user.id },
            { label: 'Email', value: user.email },
            { label: 'Ngày tham gia', value: new Date(user.createdAt).toLocaleString('vi-VN') },
            { label: 'Hoạt động lần cuối', value: user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString('vi-VN') : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-outline">{label}</p>
              <p className="mt-0.5 text-[13px] text-on-surface break-all">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
