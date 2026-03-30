import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { MagnifyingGlass, ProhibitInset, CheckCircle } from '@phosphor-icons/react'
import { userService } from '@/services/userService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { ROLE_LABELS } from '@/constants/navigation'
import { MOCK_USERS } from '@/mocks/data'
import type { AdminUser } from '@/types/user'
import type { UserRole } from '@/types/auth'

const ROLE_CHIP: Record<UserRole, string> = {
  admin:  'bg-primary-container text-on-primary-container',
  editor: 'bg-secondary-container text-on-secondary-container',
  user:   'bg-surface-container-high text-outline',
}

const ITEMS_PER_PAGE = 20

export function UserListPage() {
  const [items, setItems]         = useState<AdminUser[]>([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        role: roleFilter || undefined,
      })
      setItems(res.data.data)
      setTotal(res.data.metaData?.total ?? 0)
    } catch {
      if (import.meta.env.DEV) {
        let filtered = MOCK_USERS
        if (roleFilter) filtered = filtered.filter((u) => u.role === roleFilter)
        if (search)     filtered = filtered.filter((u) =>
          u.displayName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        )
        setItems(filtered); setTotal(filtered.length)
      } else gooeyToast.error('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  useEffect(() => { load() }, [load])

  const toggleBan = async (user: AdminUser) => {
    const action = user.isBanned ? 'Bỏ cấm' : 'Cấm'
    if (!confirm(`${action} người dùng ${user.displayName}?`)) return
    try {
      await userService.setBan(user.id, { banned: !user.isBanned })
      gooeyToast.success(`Đã ${user.isBanned ? 'bỏ cấm' : 'cấm'} người dùng`)
      load()
    } catch { gooeyToast.error('Thao tác thất bại') }
  }

  const changeRole = async (user: AdminUser, role: UserRole) => {
    if (role === user.role) return
    if (!confirm(`Đổi role của ${user.displayName} thành ${ROLE_LABELS[role]}?`)) return
    try {
      await userService.updateRole(user.id, { role })
      gooeyToast.success('Đã cập nhật role')
      load()
    } catch { gooeyToast.error('Cập nhật role thất bại') }
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-outline">{total} người dùng</p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Tìm theo tên, email..."
            className="w-full rounded-xl border-0 bg-card py-2 pl-9 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as UserRole | ''); setPage(1) }}
          className="rounded-xl border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
        >
          <option value="">Tất cả role</option>
          {(['user', 'editor', 'admin'] as UserRole[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[14px] text-outline">Đang tải...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-card">
          <p className="text-[14px] text-outline">Không tìm thấy người dùng nào</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container-high">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Người dùng</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Role</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Trạng thái</th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-outline">Ngày tham gia</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-surface-container-high last:border-0">
                  <td className="px-5 py-3.5">
                    <Link to={`/users/${user.id}`} className="hover:underline">
                      <p className="text-[14px] font-medium text-on-surface">{user.displayName}</p>
                      <p className="text-[12px] text-outline">{user.email}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user, e.target.value as UserRole)}
                      className={`rounded-full border-0 px-2.5 py-0.5 text-[11px] font-semibold outline-none cursor-pointer ${ROLE_CHIP[user.role]}`}
                    >
                      {(['user', 'editor', 'admin'] as UserRole[]).map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${user.isBanned ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary-container text-on-primary-container'}`}>
                      {user.isBanned ? 'Bị cấm' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-on-surface-variant">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleBan(user)}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-outline transition-colors ${user.isBanned ? 'hover:bg-primary-container hover:text-primary' : 'hover:bg-tertiary-container hover:text-tertiary'}`}
                      title={user.isBanned ? 'Bỏ cấm' : 'Cấm'}
                    >
                      {user.isBanned
                        ? <CheckCircle size={15} />
                        : <ProhibitInset size={15} />
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-[13px] text-outline transition-colors hover:bg-surface-container-low disabled:opacity-40">Trước</button>
          <span className="text-[13px] text-on-surface-variant">{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-[13px] text-outline transition-colors hover:bg-surface-container-low disabled:opacity-40">Tiếp</button>
        </div>
      )}
    </div>
  )
}
