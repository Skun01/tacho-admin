import { useState, useEffect, type KeyboardEvent, type MouseEvent } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextAaIcon } from '@phosphor-icons/react'

export interface FillBlankConfigValues {
  blankWord: string
  hint: string
  answerList: string[]
}

interface FillBlankConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sentenceText: string
  initialValues: FillBlankConfigValues
  onSave: (values: FillBlankConfigValues) => void
  labels: {
    title: string
    description: string
    selectHint: string
    blankWordLabel: string
    blankWordPlaceholder: string
    hintLabel: string
    hintPlaceholder: string
    answerListLabel: string
    answerListPlaceholder: string
    saveLabel: string
    cancelLabel: string
  }
}

export function FillBlankConfigDialog({
  open,
  onOpenChange,
  sentenceText,
  initialValues,
  onSave,
  labels,
}: FillBlankConfigDialogProps) {
  const [blankWord, setBlankWord] = useState(initialValues.blankWord)
  const [hint, setHint] = useState(initialValues.hint)
  const [answerList, setAnswerList] = useState<string[]>(initialValues.answerList)
  const [answerInput, setAnswerInput] = useState('')

  useEffect(() => {
    if (open) {
      setBlankWord(initialValues.blankWord)
      setHint(initialValues.hint)
      setAnswerList([...initialValues.answerList])
      setAnswerInput('')
    }
  }, [open, initialValues.blankWord, initialValues.hint, initialValues.answerList])

  const handleTextMouseUp = (e: MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (start === end) return

    const selected = textarea.value.slice(start, end).trim()
    if (selected) {
      setBlankWord(selected)
      if (!answerList.includes(selected)) {
        setAnswerList((prev) => [...prev, selected])
      }
    }
  }

  const handleAnswerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const trimmed = answerInput.trim()
    if (!trimmed) return
    if (!answerList.includes(trimmed)) {
      setAnswerList((prev) => [...prev, trimmed])
    }
    setAnswerInput('')
  }

  const handleRemoveAnswer = (answer: string) => {
    setAnswerList((prev) => prev.filter((a) => a !== answer))
  }

  const handleSave = () => {
    onSave({
      blankWord: blankWord.trim(),
      hint: hint.trim(),
      answerList,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <TextAaIcon size={16} style={{ color: 'var(--on-surface-variant)' }} />
              <Label className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                {labels.selectHint}
              </Label>
            </div>
            <textarea
              readOnly
              value={sentenceText}
              onMouseUp={handleTextMouseUp}
              className="w-full resize-none rounded-md border p-3 text-sm leading-relaxed focus:outline-none"
              style={{
                backgroundColor: 'var(--surface-container-low)',
                borderColor: 'var(--outline-variant)',
                color: 'var(--on-surface)',
                cursor: 'text',
                minHeight: '64px',
              }}
              rows={Math.min(Math.ceil(sentenceText.length / 40), 4)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{labels.blankWordLabel}</Label>
            <Input
              value={blankWord}
              onChange={(e) => setBlankWord(e.target.value)}
              placeholder={labels.blankWordPlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{labels.hintLabel}</Label>
            <Input
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder={labels.hintPlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{labels.answerListLabel}</Label>
            {answerList.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {answerList.map((answer) => (
                  <span
                    key={answer}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm"
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
            )}
            <Input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={handleAnswerKeyDown}
              placeholder={labels.answerListPlaceholder}
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {labels.cancelLabel}
          </Button>
          <Button type="button" onClick={handleSave}>
            {labels.saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
