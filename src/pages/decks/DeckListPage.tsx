import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { DeckTable } from '@/components/decks/DeckTable'
import { deckService } from '@/services/deckService'
import { DECK_TYPE_LABELS, DECKS_PER_PAGE, DECK_COPY } from '@/constants/decks'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { MOCK_DECKS } from '@/mocks/data'
import type { Deck, DeckType } from '@/types/deck'

export function DeckListPage() {
  const [items, setItems]             = useState<Deck[]>([])
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState<DeckType | ''>('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await deckService.list({
        page,
        limit: DECKS_PER_PAGE,
        search: search || undefined,
        deckType: typeFilter || undefined,
      })
      setItems(res.data.data)
      setTotal(res.data.metaData?.total ?? 0)
    } catch {
      if (import.meta.env.DEV) {
        let filtered = MOCK_DECKS
        if (typeFilter) filtered = filtered.filter((d) => d.deckType === typeFilter)
        if (search)     filtered = filtered.filter((d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description?.toLowerCase().includes(search.toLowerCase())
        )
        setItems(filtered); setTotal(filtered.length)
      } else gooeyToast.error('Không thể tải danh sách bộ thẻ')
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm(DECK_COPY.deleteConfirm)) return
    try {
      await deckService.delete(id)
      gooeyToast.success(DECK_COPY.deleteSuccess)
      load()
    } catch {
      gooeyToast.error('Xóa thất bại')
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / DECKS_PER_PAGE))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-outline">{total} bộ thẻ</p>
        <Link
          to="/decks/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={15} weight="bold" />
          Thêm bộ thẻ
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder={DECK_COPY.searchPlaceholder}
            className="w-full rounded-xl border-0 bg-card py-2 pl-9 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as DeckType | ''); setPage(1) }}
          className="rounded-xl border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
        >
          <option value="">Tất cả loại</option>
          {(Object.entries(DECK_TYPE_LABELS) as [DeckType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[14px] text-outline">Đang tải...</p>
        </div>
      ) : (
        <DeckTable items={items} onDelete={handleDelete} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-[13px] text-outline transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-[13px] text-on-surface-variant">{page} / {totalPages}</span>
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
