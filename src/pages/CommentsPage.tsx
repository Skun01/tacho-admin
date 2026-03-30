import { useEffect, useState, useCallback } from 'react'
import { Trash, MagnifyingGlass } from '@phosphor-icons/react'
import { commentService } from '@/services/commentService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { MOCK_COMMENTS } from '@/mocks/data'
import type { Comment } from '@/types/comment'

const ITEMS_PER_PAGE = 20

export function CommentsPage() {
  const [items, setItems]   = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal]   = useState(0)
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await commentService.list({
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
      })
      setItems(res.data.data)
      setTotal(res.data.metaData?.total ?? 0)
    } catch {
      if (import.meta.env.DEV) {
        let filtered = MOCK_COMMENTS.filter((c) => c.status !== 'deleted')
        if (search) filtered = filtered.filter((c) =>
          c.body.toLowerCase().includes(search.toLowerCase()) ||
          c.userDisplayName.toLowerCase().includes(search.toLowerCase()) ||
          c.cardContent.includes(search)
        )
        setItems(filtered); setTotal(filtered.length)
      } else gooeyToast.error('Không thể tải bình luận')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    if (!confirm('Xóa bình luận này?')) return
    try {
      await commentService.delete(id)
      gooeyToast.success('Đã xóa bình luận')
      load()
    } catch { gooeyToast.error('Xóa thất bại') }
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-outline">{total} bình luận</p>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Tìm theo nội dung, người dùng, thẻ..."
          className="w-full rounded-xl border-0 bg-card py-2 pl-9 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
        />
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[14px] text-outline">Đang tải...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-card">
          <p className="text-[14px] text-outline">Không có bình luận nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-2xl bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-on-surface">{c.userDisplayName}</span>
                    <span className="text-[12px] text-outline">→</span>
                    <span className="rounded-full bg-surface-container-low px-2 py-0.5 text-[12px] text-on-surface-variant" style={{ fontFamily: "'Kiwi Maru', serif" }}>
                      {c.cardContent}
                    </span>
                    <span className="ml-auto text-[11px] text-outline">
                      {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-on-surface">{c.body}</p>
                </div>
                <button
                  onClick={() => del(c.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
                  title="Xóa bình luận"
                >
                  <Trash size={15} />
                </button>
              </div>
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
