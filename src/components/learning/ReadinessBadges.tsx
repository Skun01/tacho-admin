import { Badge } from '@/components/ui/badge'
import { STUDY_MODE_LABELS } from '@/types/learningAdmin'
import type { StudyMode } from '@/types/learningAdmin'

interface ReadinessBadgesProps {
  modes: StudyMode[]
  allModes?: StudyMode[]
}

const MODE_VARIANT_MAP: Record<StudyMode, 'default' | 'secondary' | 'outline'> = {
  FillInBlank: 'default',
  MultipleChoice: 'secondary',
  Flashcard: 'outline',
}

export function ReadinessBadges({ modes, allModes = ['FillInBlank', 'MultipleChoice', 'Flashcard'] }: ReadinessBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {allModes.map((mode) => {
        const isReady = modes.includes(mode)
        return (
          <Badge
            key={mode}
            variant={isReady ? MODE_VARIANT_MAP[mode] : 'outline'}
            className={`text-xs ${!isReady ? 'opacity-30 line-through' : ''}`}
          >
            {STUDY_MODE_LABELS[mode]}
          </Badge>
        )
      })}
    </div>
  )
}
