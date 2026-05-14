import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@phosphor-icons/react'
import { ADMIN_LEARNING_CONTENT } from '@/constants/adminLearning'
import type { LearningAdminCardSentenceConfigResponse } from '@/types/learningAdmin'
import { useState, type KeyboardEvent } from 'react'

const C = ADMIN_LEARNING_CONTENT.cardConfig

interface SentenceConfigRowProps {
  sentence: LearningAdminCardSentenceConfigResponse
  onBlankWordChange: (value: string) => void
  onHintChange: (value: string) => void
  onAnswerListChange: (value: string[]) => void
  onRemove: () => void
}

export function SentenceConfigRow({
  sentence,
  onBlankWordChange,
  onHintChange,
  onAnswerListChange,
  onRemove,
}: SentenceConfigRowProps) {
  const [answerInput, setAnswerInput] = useState('')

  const handleAnswerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const trimmed = answerInput.trim()
    if (!trimmed) return
    if (!sentence.answerList.includes(trimmed)) {
      onAnswerListChange([...sentence.answerList, trimmed])
    }
    setAnswerInput('')
  }

  const handleRemoveAnswer = (answer: string) => {
    onAnswerListChange(sentence.answerList.filter((a) => a !== answer))
  }

  return (
    <div
      className="rounded-lg border p-4 space-y-3"
      style={{ backgroundColor: 'var(--surface-container-lowest)' }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>{sentence.jp}</p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--on-surface-variant)' }}>{sentence.en}</p>
          {sentence.level && (
            <span className="mt-1 inline-block text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
              {sentence.level}
            </span>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-destructive shrink-0">
          <TrashIcon size={16} />
        </Button>
      </div>

      {/* Editable fields */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">{C.blankWordLabel}</Label>
          <Input
            value={sentence.blankWord ?? ''}
            onChange={(e) => onBlankWordChange(e.target.value)}
            placeholder={C.blankWordPlaceholder}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{C.hintLabel}</Label>
          <Input
            value={sentence.hint ?? ''}
            onChange={(e) => onHintChange(e.target.value)}
            placeholder={C.hintPlaceholder}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Answer list */}
      <div className="space-y-1">
        <Label className="text-xs">{C.answerListLabel}</Label>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {sentence.answerList.map((answer) => (
            <span
              key={answer}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
              style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' }}
            >
              {answer}
              <button
                type="button"
                className="ml-0.5 opacity-60 hover:opacity-100"
                onClick={() => handleRemoveAnswer(answer)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          onKeyDown={handleAnswerKeyDown}
          placeholder={C.answerListPlaceholder}
          className="h-8 text-sm"
        />
      </div>
    </div>
  )
}
