import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bell, Trash, Plus, X } from '@phosphor-icons/react'
import { notificationService } from '@/services/notificationService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { MOCK_NOTIFICATIONS } from '@/mocks/data'
import type { SystemNotif, NotifType, NotifTargetScope } from '@/types/notification'

const TYPE_LABELS: Record<NotifType, string> = {
  system:      'Hệ thống',
  achievement: 'Thành tích',
  reminder:    'Nhắc nhở',
  social:      'Xã hội',
}

const SCOPE_LABELS: Record<NotifTargetScope, string> = {
  all:  'Tất cả người dùng',
  role: 'Theo role',
  user: 'Người dùng cụ thể',
}

const schema = z.object({
  title:      z.string().min(1, 'Bắt buộc'),
  body:       z.string().min(1, 'Bắt buộc'),
  type:       z.enum(['system', 'achievement', 'reminder', 'social']),
  targetScope: z.enum(['all', 'role', 'user']),
  targetRole: z.string().optional(),
  targetUserId: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

const ITEMS_PER_PAGE = 20

export function SystemNotifPage() {
  const [items, setItems]         = useState<SystemNotif[]>([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [showForm, setShowForm]   = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { type: 'system', targetScope: 'all' },
    })

  const targetScope = watch('targetScope')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await notificationService.list({ page, limit: ITEMS_PER_PAGE })
      setItems(res.data.data)
      setTotal(res.data.metaData?.total ?? 0)
    } catch {
      if (import.meta.env.DEV) { setItems(MOCK_NOTIFICATIONS); setTotal(MOCK_NOTIFICATIONS.length) }
      else gooeyToast.error('Không thể tải thông báo')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const onSubmit = async (values: FormValues) => {
    try {
      await notificationService.create({
        title:        values.title,
        body:         values.body,
        type:         values.type as NotifType,
        targetScope:  values.targetScope as NotifTargetScope,
        targetRole:   values.targetRole   || undefined,
        targetUserId: values.targetUserId || undefined,
      })
      gooeyToast.success('Đã gửi thông báo')
      reset()
      setShowForm(false)
      load()
    } catch {
      gooeyToast.error('Gửi thông báo thất bại')
    }
  }

  const del = async (id: string) => {
    if (!confirm('Xóa thông báo này?')) return
    try {
      await notificationService.delete(id)
      gooeyToast.success('Đã xóa thông báo')
      load()
    } catch { gooeyToast.error('Xóa thất bại') }
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-outline">{total} thông báo</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showForm ? <X size={15} weight="bold" /> : <Plus size={15} weight="bold" />}
          {showForm ? 'Đóng' : 'Tạo thông báo'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <section className="rounded-2xl bg-card p-6">
          <h3 className="mb-5 text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Thông báo mới
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Loại thông báo</label>
                <select {...register('type')} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary">
                  {(Object.entries(TYPE_LABELS) as [NotifType, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Đối tượng</label>
                <select {...register('targetScope')} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary">
                  {(Object.entries(SCOPE_LABELS) as [NotifTargetScope, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              {targetScope === 'role' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">Role</label>
                  <select {...register('targetRole')} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary">
                    <option value="user">Người dùng</option>
                    <option value="editor">Biên tập viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              )}
              {targetScope === 'user' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-on-surface-variant">User ID</label>
                  <input {...register('targetUserId')} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary" placeholder="UUID người dùng" />
                </div>
              )}

              <div className={`flex flex-col gap-1.5 ${targetScope === 'all' ? 'col-span-2' : ''}`}>
                <label className="text-[13px] font-medium text-on-surface-variant">Tiêu đề</label>
                <input {...register('title')} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary" placeholder="Tiêu đề thông báo" />
                {errors.title && <span className="text-[12px] text-tertiary">{errors.title.message}</span>}
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-on-surface-variant">Nội dung</label>
                <textarea {...register('body')} rows={3} className="rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary resize-y" placeholder="Nội dung thông báo..." />
                {errors.body && <span className="text-[12px] text-tertiary">{errors.body.message}</span>}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting}
                className="rounded-xl bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                {isSubmitting ? 'Đang gửi...' : 'Gửi thông báo'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* List */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[14px] text-outline">Đang tải...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-card">
          <p className="text-[14px] text-outline">Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className="flex items-start gap-4 rounded-2xl bg-card p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container">
                <Bell size={18} weight="duotone" className="text-secondary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-on-surface">{n.title}</p>
                  <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 text-[11px] font-medium text-outline">
                    {TYPE_LABELS[n.type]}
                  </span>
                  <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[11px] font-medium text-on-secondary-container">
                    {SCOPE_LABELS[n.targetScope]}
                  </span>
                </div>
                <p className="text-[13px] text-on-surface-variant">{n.body}</p>
                <p className="text-[11px] text-outline">{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button onClick={() => del(n.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary">
                <Trash size={14} />
              </button>
            </div>
          ))}
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
