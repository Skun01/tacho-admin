import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { Plus, MagnifyingGlass, FunnelSimple } from '@phosphor-icons/react'
import { CardTable } from '@/components/cards/CardTable'
import { cardService } from '@/services/cardService'
import { JLPT_LEVELS, CARD_TYPE_LABELS, CARDS_PER_PAGE, CARD_COPY } from '@/constants/cards'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { MOCK_CARDS } from '@/mocks/data'
import type { CardListItem, CardType, JlptLevel } from '@/types/card'

export function CardListPage() {
  const [items, setItems]           = useState<CardListItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState<CardType | ''>('')
  const [jlptFilter, setJlptFilter] = useState<JlptLevel | ''>('')
  const [showDeleted, setShowDeleted] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cardService.list({
        page,
        limit: CARDS_PER_PAGE,
        search: search || undefined,
        type: typeFilter || undefined,
        jlptLevel: jlptFilter || undefined,
        includeDeleted: showDeleted,
      })
      setItems(res.data.data)
      setTotal(res.data.metaData?.total ?? 0)
    } catch {
      if (import.meta.env.DEV) {
        let filtered = MOCK_CARDS
        if (typeFilter)  filtered = filtered.filter((c) => c.type === typeFilter)
        if (jlptFilter)  filtered = filtered.filter((c) => c.jlptLevel === jlptFilter)
        if (search)      filtered = filtered.filter((c) =>
          c.content.includes(search) || c.reading?.includes(search) || c.meaning.includes(search)
        )
        setItems(filtered); setTotal(filtered.length)
      } else gooeyToast.error('Không thể tải danh sách thẻ')
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, jlptFilter, showDeleted])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm(CARD_COPY.deleteConfirm)) return
    try {
      await cardService.softDelete(id)
      gooeyToast.success(CARD_COPY.deleteSuccess)
      load()
    } catch {
      gooeyToast.error('Xóa thất bại')
    }
  }

  const handleRestore = async (id: string) => {
    if (!confirm(CARD_COPY.restoreConfirm)) return
    try {
      await cardService.restore(id)
      gooeyToast.success(CARD_COPY.restoreSuccess)
      load()
    } catch {
      gooeyToast.error('Khôi phục thất bại')
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / CARDS_PER_PAGE))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-outline">{total} thẻ</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/cards/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus size={15} weight="bold" />
            Thêm thẻ
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder={CARD_COPY.searchPlaceholder}
            className="w-full rounded-xl border-0 bg-card py-2 pl-9 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          <FunnelSimple size={14} className="text-outline" />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as CardType | ''); setPage(1) }}
            className="rounded-xl border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          >
            <option value="">Tất cả loại</option>
            {(Object.entries(CARD_TYPE_LABELS) as [CardType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* JLPT filter */}
        <select
          value={jlptFilter}
          onChange={(e) => { setJlptFilter(e.target.value as JlptLevel | ''); setPage(1) }}
          className="rounded-xl border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
        >
          <option value="">Tất cả JLPT</option>
          {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Show deleted toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-on-surface-variant">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => { setShowDeleted(e.target.checked); setPage(1) }}
            className="accent-primary"
          />
          Hiện đã xóa
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[14px] text-outline">Đang tải...</p>
        </div>
      ) : (
        <CardTable items={items} onDelete={handleDelete} onRestore={handleRestore} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-[13px] text-outline transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-[13px] text-on-surface-variant">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-[13px] text-outline transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  )
}
