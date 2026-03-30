import { useState } from 'react'
import { VocabCardForm } from '@/components/cards/VocabCardForm'
import { GrammarCardForm } from '@/components/cards/GrammarCardForm'
import type { CardType } from '@/types/card'
import { CARD_TYPE_LABELS } from '@/constants/cards'

export function CardCreatePage() {
  const [type, setType] = useState<CardType>('vocab')

  return (
    <div className="space-y-6">
      {/* Type toggle */}
      <div className="flex gap-2 rounded-2xl bg-card p-1.5" style={{ width: 'fit-content' }}>
        {(['vocab', 'grammar'] as CardType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={[
              'rounded-xl px-5 py-2 text-[13px] font-semibold transition-colors',
              type === t
                ? 'bg-primary text-primary-foreground'
                : 'text-outline hover:bg-surface-container-low',
            ].join(' ')}
          >
            {CARD_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {type === 'vocab' ? <VocabCardForm /> : <GrammarCardForm />}
    </div>
  )
}
