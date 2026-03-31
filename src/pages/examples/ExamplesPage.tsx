import { useState } from 'react'
import { Plus, MagnifyingGlass, PencilSimple, Trash, X, Check } from '@phosphor-icons/react'
import type { CreateExampleDTO } from '@/types/example'
import type { JlptLevel } from '@/types/card'
import { JLPT_LEVELS } from '@/constants/cards'
import { useExampleStore } from '@/stores/exampleStore'

function plain(str: string): string {
  return str.replace(/\{([^|{}]+)\|[^}]+\}/g, '$1').replace(/\{([^|{}]+)\}/g, '$1')
}

const EMPTY_FORM = (): CreateExampleDTO => ({
  japaneseSentence: '',
  vietnameseMeaning: '',
  jlptLevel: undefined,
})

interface ExampleFormPanelProps {
  initial?: CreateExampleDTO
  onSave: (dto: CreateExampleDTO) => void
  onCancel: () => void
}

function ExampleFormPanel({ initial, onSave, onCancel }: ExampleFormPanelProps) {
  const [form, setForm] = useState<CreateExampleDTO>(initial ?? EMPTY_FORM())
  const [error, setError] = useState('')

  const set = <K extends keyof CreateExampleDTO>(k: K, v: CreateExampleDTO[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.japaneseSentence.trim()) { setError('Bắt buộc nhập câu tiếng Nhật'); return }
    if (!form.vietnameseMeaning.trim()) { setError('Bắt buộc nhập nghĩa tiếng Việt'); return }
    onSave(form)
  }

  const inputCls = "w-full rounded-xl border-0 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"

  return (
    <div className="rounded-2xl bg-card p-5 space-y-4 ring-2 ring-primary/30">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
        {initial ? 'Chỉnh sửa ví dụ' : 'Thêm ví dụ mới'}
      </p>

      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-on-surface-variant">Câu tiếng Nhật *</label>
          <input
            value={form.japaneseSentence}
            onChange={(e) => set('japaneseSentence', e.target.value)}
            className={inputCls}
            placeholder="{今日|きょう}は{天気|てんき}がいいですね"
            style={{ fontFamily: "'Kiwi Maru', serif" }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-on-surface-variant">Nghĩa tiếng Việt *</label>
          <input
            value={form.vietnameseMeaning}
            onChange={(e) => set('vietnameseMeaning', e.target.value)}
            className={inputCls}
            placeholder="Hôm nay thời tiết đẹp nhỉ."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-on-surface-variant">Cấp JLPT (tuỳ chọn)</label>
          <select
            value={form.jlptLevel ?? ''}
            onChange={(e) => set('jlptLevel', (e.target.value as JlptLevel) || undefined)}
            className={inputCls}
          >
            <option value="">— Không xác định</option>
            {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-[12px] text-tertiary">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-medium text-outline hover:bg-surface-container-low transition-colors"
        >
          <X size={13} /> Huỷ
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Check size={13} weight="bold" /> Lưu
        </button>
      </div>
    </div>
  )
}

export function ExamplesPage() {
  const examples    = useExampleStore((s) => s.examples)
  const storeAdd    = useExampleStore((s) => s.add)
  const storeUpdate = useExampleStore((s) => s.update)
  const storeRemove = useExampleStore((s) => s.remove)

  const [query, setQuery]           = useState('')
  const [jlptFilter, setJlptFilter] = useState<JlptLevel | ''>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [deletingId, setDeletingId]   = useState<string | null>(null)

  const filtered = examples.filter((ex) => {
    const matchQuery =
      !query ||
      plain(ex.japaneseSentence).includes(query) ||
      ex.vietnameseMeaning.toLowerCase().includes(query.toLowerCase())
    const matchJlpt = !jlptFilter || ex.jlptLevel === jlptFilter
    return matchQuery && matchJlpt
  })

  const handleAdd = (dto: CreateExampleDTO) => {
    storeAdd(dto)
    setShowAddForm(false)
  }

  const handleEdit = (id: string, dto: CreateExampleDTO) => {
    storeUpdate(id, dto)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    storeRemove(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm câu ví dụ..."
            className="w-full rounded-xl border-0 bg-card pl-8 pr-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
          />
        </div>
        <select
          value={jlptFilter}
          onChange={(e) => setJlptFilter(e.target.value as JlptLevel | '')}
          className="rounded-xl border-0 bg-card px-3 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
        >
          <option value="">Tất cả cấp</option>
          {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <button
          type="button"
          onClick={() => { setShowAddForm(true); setEditingId(null) }}
          className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={14} weight="bold" />
          Thêm ví dụ
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <ExampleFormPanel
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Count */}
      <p className="text-[12px] text-outline">
        {filtered.length} / {examples.length} câu ví dụ
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-[13px] text-outline">Không có câu ví dụ nào</p>
        )}

        {filtered.map((ex) => (
          <div key={ex.id}>
            {editingId === ex.id ? (
              <ExampleFormPanel
                initial={{ japaneseSentence: ex.japaneseSentence, vietnameseMeaning: ex.vietnameseMeaning, jlptLevel: ex.jlptLevel }}
                onSave={(dto) => handleEdit(ex.id, dto)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="group flex items-start gap-4 rounded-2xl bg-card px-5 py-4 transition-colors hover:bg-surface-container-low">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[15px] leading-snug text-on-surface"
                    style={{ fontFamily: "'Kiwi Maru', serif" }}
                  >
                    {plain(ex.japaneseSentence)}
                  </p>
                  <p className="mt-1 text-[13px] text-on-surface-variant">
                    {ex.vietnameseMeaning}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {ex.jlptLevel && (
                    <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[11px] font-semibold text-on-primary-container">
                      {ex.jlptLevel}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => { setEditingId(ex.id); setShowAddForm(false) }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-outline opacity-0 transition-all group-hover:opacity-100 hover:bg-surface-container"
                  >
                    <PencilSimple size={13} />
                  </button>
                  {deletingId === ex.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(ex.id)}
                        className="rounded-lg bg-tertiary px-2.5 py-1 text-[12px] font-semibold text-on-tertiary"
                      >
                        Xoá
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="rounded-lg px-2 py-1 text-[12px] text-outline hover:bg-surface-container"
                      >
                        Huỷ
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeletingId(ex.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-outline opacity-0 transition-all group-hover:opacity-100 hover:bg-tertiary-container hover:text-tertiary"
                    >
                      <Trash size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
