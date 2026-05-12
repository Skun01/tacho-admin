import { Button } from '@/components/ui/button'
import { FormItem, FormLabel } from '@/components/ui/form'
import { ADMIN_VOCABULARY_CONTENT } from '@/constants/adminContent'

interface PitchPoint {
  key: string
  cx: number
  cy: number
}

interface VocabularyPitchPanelProps {
  readingChars: string[]
  pitchPattern: number[]
  pitchChart: {
    width: number
    syllableWidth: number
    points: string[]
    circles: PitchPoint[]
  }
  onTogglePitchAt: (index: number) => void
}

export function VocabularyPitchPanel({ readingChars, pitchPattern, pitchChart, onTogglePitchAt }: VocabularyPitchPanelProps) {
  return (
    <FormItem>
      <FormLabel className="inline-flex h-5 items-center leading-5">{ADMIN_VOCABULARY_CONTENT.form.pitchPatternLabel}</FormLabel>
      <div className="rounded-md border px-2 py-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--surface) 90%, var(--primary) 2%)' }}>
        <div className="mx-auto overflow-x-auto" style={{ width: pitchChart.width }}>
          <svg className="h-6" style={{ width: pitchChart.width }} viewBox={`0 0 ${pitchChart.width} 24`} role="img" aria-label={ADMIN_VOCABULARY_CONTENT.form.pitchContourLabel}>
            <line x1={0} y1={12} x2={pitchChart.width} y2={12} stroke="var(--border)" strokeWidth={1} />
            {pitchChart.points.length > 1 && <polyline points={pitchChart.points.join(' ')} fill="none" stroke="var(--primary)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />}
            {pitchChart.circles.map((point) => (
              <circle key={point.key} cx={point.cx} cy={point.cy} r={2.5} fill="var(--primary)" />
            ))}
          </svg>

          <div className="mt-0.5 flex" style={{ width: pitchChart.width }}>
            {readingChars.map((char, index) => {
              const isHigh = (pitchPattern[index] ?? 0) > 0
              return (
                <div key={`${char}-${index}`} className="flex justify-center" style={{ width: pitchChart.syllableWidth }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-full min-w-0 px-0.5 text-xs font-medium"
                    style={{ color: isHigh ? 'var(--primary)' : 'var(--on-surface)' }}
                    onClick={() => onTogglePitchAt(index)}
                    aria-label={`${char} ${isHigh ? ADMIN_VOCABULARY_CONTENT.form.pitchPatternHighLabel : ADMIN_VOCABULARY_CONTENT.form.pitchPatternLowLabel}`}
                  >
                    {char}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-1 text-center text-[11px]" style={{ color: 'var(--on-surface-variant)' }}>
          {ADMIN_VOCABULARY_CONTENT.form.pitchPatternDescriptionLabel}
        </p>
      </div>
    </FormItem>
  )
}
