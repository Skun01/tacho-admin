import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { VocabCardForm } from '@/components/cards/VocabCardForm'
import { GrammarCardForm } from '@/components/cards/GrammarCardForm'
import { cardService } from '@/services/cardService'
import type { AnyCard } from '@/types/card'
import { MOCK_VOCAB_CARDS, MOCK_GRAMMAR_CARDS } from '@/mocks/data'

export function CardEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<AnyCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    cardService.getById(id)
      .then((res) => setCard(res.data.data))
      .catch(() => {
        if (import.meta.env.DEV) {
          const mock =
            (MOCK_VOCAB_CARDS.find((c) => c.id === id) as AnyCard | undefined) ??
            (MOCK_GRAMMAR_CARDS.find((c) => c.id === id) as AnyCard | undefined)
          if (mock) { setCard(mock) } else { setError('Không tìm thấy thẻ') }
        } else {
          setError('Không tìm thấy thẻ')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[14px] text-outline">Đang tải...</p>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <p className="text-[14px] text-tertiary">{error ?? 'Không tìm thấy thẻ'}</p>
        <button
          onClick={() => navigate('/cards')}
          className="rounded-xl bg-surface-container-low px-4 py-2 text-[13px] text-outline hover:bg-accent"
        >
          Quay lại
        </button>
      </div>
    )
  }

  return card.type === 'vocab'
    ? <VocabCardForm initial={card} />
    : <GrammarCardForm initial={card} />
}
