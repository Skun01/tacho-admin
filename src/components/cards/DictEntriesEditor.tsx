import { Plus, Trash, PlusCircle } from '@phosphor-icons/react'
import type { DictEntry } from '@/types/card'
import { PART_OF_SPEECH_OPTIONS } from '@/constants/cards'

interface DictEntriesEditorProps {
  entries: DictEntry[]
  onChange: (entries: DictEntry[]) => void
}

const EMPTY_ENTRY = (position: number): DictEntry => ({
  partOfSpeech: '',
  definitions: [{ definition: '', position: 0 }],
  position,
})

export function DictEntriesEditor({ entries, onChange }: DictEntriesEditorProps) {
  const addEntry = () => onChange([...entries, EMPTY_ENTRY(entries.length)])

  const removeEntry = (idx: number) =>
    onChange(entries.filter((_, i) => i !== idx).map((e, i) => ({ ...e, position: i })))

  const updateEntry = <K extends keyof DictEntry>(idx: number, key: K, value: DictEntry[K]) =>
    onChange(entries.map((e, i) => (i === idx ? { ...e, [key]: value } : e)))

  const addDef = (entryIdx: number) => {
    const entry = entries[entryIdx]
    const updated = {
      ...entry,
      definitions: [...entry.definitions, { definition: '', position: entry.definitions.length }],
    }
    onChange(entries.map((e, i) => (i === entryIdx ? updated : e)))
  }

  const removeDef = (entryIdx: number, defIdx: number) => {
    const entry = entries[entryIdx]
    const updated = {
      ...entry,
      definitions: entry.definitions
        .filter((_, i) => i !== defIdx)
        .map((d, i) => ({ ...d, position: i })),
    }
    onChange(entries.map((e, i) => (i === entryIdx ? updated : e)))
  }

  const updateDef = (entryIdx: number, defIdx: number, value: string) => {
    const entry = entries[entryIdx]
    const updated = {
      ...entry,
      definitions: entry.definitions.map((d, i) => (i === defIdx ? { ...d, definition: value } : d)),
    }
    onChange(entries.map((e, i) => (i === entryIdx ? updated : e)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-on-surface-variant">Từ điển (Dict entries)</p>
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-1.5 rounded-lg bg-secondary-container px-3 py-1.5 text-[12px] font-medium text-on-secondary-container transition-opacity hover:opacity-80"
        >
          <Plus size={13} weight="bold" />
          Thêm từ loại
        </button>
      </div>

      {entries.length === 0 && (
        <p className="py-4 text-center text-[13px] text-outline">Chưa có mục từ điển nào</p>
      )}

      {entries.map((entry, eIdx) => (
        <div key={eIdx} className="rounded-xl bg-surface-container-low p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">Mục #{eIdx + 1}</span>
            <button
              type="button"
              onClick={() => removeEntry(eIdx)}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
            >
              <Trash size={13} />
            </button>
          </div>

          {/* Part of speech */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant">Từ loại</label>
            <select
              value={entry.partOfSpeech}
              onChange={(e) => updateEntry(eIdx, 'partOfSpeech', e.target.value)}
              className="rounded-lg border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
            >
              <option value="">Chọn từ loại...</option>
              {PART_OF_SPEECH_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Definitions */}
          <div className="space-y-2">
            <p className="text-[12px] text-on-surface-variant">Định nghĩa</p>
            {entry.definitions.map((def, dIdx) => (
              <div key={dIdx} className="flex items-center gap-2">
                <span className="shrink-0 text-[11px] font-bold text-outline">{dIdx + 1}.</span>
                <input
                  value={def.definition}
                  onChange={(e) => updateDef(eIdx, dIdx, e.target.value)}
                  className="flex-1 rounded-lg border-0 bg-card px-3 py-2 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
                  placeholder="Nhập định nghĩa..."
                />
                {entry.definitions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDef(eIdx, dIdx)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-outline transition-colors hover:bg-tertiary-container hover:text-tertiary"
                  >
                    <Trash size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDef(eIdx)}
              className="flex items-center gap-1 text-[12px] text-outline transition-colors hover:text-primary"
            >
              <PlusCircle size={14} />
              Thêm định nghĩa
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
