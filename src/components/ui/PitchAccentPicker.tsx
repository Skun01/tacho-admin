import { useEffect } from 'react'

const MORA_W = 46
const LINE_HIGH = 7
const LINE_LOW = 27
const SVG_H = 38
const TEXT_H = 26

/**
 * Split a hiragana/katakana reading into morae.
 * Compound kana (きゃ, ちゅ…) count as a single mora.
 * Also strips furigana markers like {漢字|ふりがな}.
 */
function splitMorae(reading: string): string[] {
  const stripped = reading.replace(/\{[^}]*\|([^}]+)\}/g, '$1')
  const combineAfter = new Set('ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ')
  const morae: string[] = []
  for (let i = 0; i < stripped.length; i++) {
    if (i + 1 < stripped.length && combineAfter.has(stripped[i + 1])) {
      morae.push(stripped[i] + stripped[i + 1])
      i++
    } else {
      morae.push(stripped[i])
    }
  }
  return morae
}

/** Build an SVG path string for the jisho-style connected pitch line. */
function buildPath(pattern: number[], n: number): string {
  if (n === 0) return ''
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const x1 = i * MORA_W + 6
    const x2 = (i + 1) * MORA_W - 6
    const y = (pattern[i] ?? 0) === 1 ? LINE_HIGH : LINE_LOW
    if (i === 0) {
      pts.push(`M ${x1} ${y}`)
    } else {
      const prevY = (pattern[i - 1] ?? 0) === 1 ? LINE_HIGH : LINE_LOW
      if (prevY !== y) pts.push(`L ${x1} ${y}`)
    }
    pts.push(`L ${x2} ${y}`)
  }
  return pts.join(' ')
}

interface PitchAccentPickerProps {
  reading: string
  pattern: number[]
  onChange: (pattern: number[]) => void
}

export function PitchAccentPicker({ reading, pattern, onChange }: PitchAccentPickerProps) {
  const morae = splitMorae(reading)

  useEffect(() => {
    if (morae.length === 0) {
      if (pattern.length > 0) onChange([])
      return
    }
    if (morae.length === pattern.length) return
    if (morae.length > pattern.length) {
      onChange([...pattern, ...new Array(morae.length - pattern.length).fill(0)])
    } else {
      onChange(pattern.slice(0, morae.length))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morae.length])

  const toggle = (i: number) => {
    const next = [...pattern]
    next[i] = (next[i] ?? 0) === 1 ? 0 : 1
    onChange(next)
  }

  if (morae.length === 0) {
    return (
      <p className="py-2 text-[12px] italic text-outline">
        Nhập cách đọc bên trên để đánh dấu pitch
      </p>
    )
  }

  const totalW = morae.length * MORA_W
  const totalH = SVG_H + TEXT_H

  return (
    <div>
      <div className="relative flex" style={{ width: totalW, height: totalH }}>
        {/* SVG pitch lines */}
        <svg
          className="pointer-events-none absolute left-0 top-0 text-primary"
          width={totalW}
          height={SVG_H}
        >
          {/* Shadow/glow for better visibility */}
          <path
            d={buildPath(pattern, morae.length)}
            stroke="currentColor"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
            strokeDasharray="none"
          />
          <path
            d={buildPath(pattern, morae.length)}
            stroke="currentColor"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dots at each mora center */}
          {morae.map((_, i) => {
            const cx = i * MORA_W + MORA_W / 2
            const cy = (pattern[i] ?? 0) === 1 ? LINE_HIGH : LINE_LOW
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="3.5"
                fill="currentColor"
              />
            )
          })}
        </svg>

        {/* Clickable mora buttons */}
        {morae.map((mora, i) => {
          const isHigh = (pattern[i] ?? 0) === 1
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              title={isHigh ? 'Cao — click để đổi thấp' : 'Thấp — click để đổi cao'}
              className="group flex flex-col items-center justify-end"
              style={{ width: MORA_W, height: totalH }}
            >
              <span
                className={[
                  'select-none text-[15px] leading-none transition-colors',
                  'font-kiwi',
                  isHigh
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant group-hover:text-on-surface',
                ].join(' ')}
                style={{ height: TEXT_H, lineHeight: `${TEXT_H}px` }}
              >
                {mora}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-outline">
        Click âm tiết để đổi <span className="text-primary font-medium">cao</span> ↔ thấp
      </p>
    </div>
  )
}
