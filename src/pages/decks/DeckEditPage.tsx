import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Trash, ArrowUp, ArrowDown, MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { DeckForm } from '@/components/decks/DeckForm'
import { deckService } from '@/services/deckService'
import { cardService } from '@/services/cardService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { JLPT_COLORS, CARD_TYPE_LABELS } from '@/constants/cards'
import { DECK_COPY } from '@/constants/decks'
import type { DeckDetail, DeckCardItem } from '@/types/deck'
import type { CardListItem } from '@/types/card'

export function DeckEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate  = useNavigate()

  const [deck, setDeck]             = useState<DeckDetail | null>(null)
  const [loading, setLoading]       = useState(true)
  const [cardSearch, setCardSearch] = useState('')
  const [searchResults, setSearchResults] = useState<CardListItem[]>([])
  const [searching, setSearching]   = useState(false)

  const reload = () => {
    if (!id) return
    deckService.getById(id)
      .then((r) => setDeck(r.data.data))
      .catch(() => gooeyToast.error('Không thể tải bộ thẻ'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { reload() }, [id])

  const searchCards = async () => {
    if (!cardSearch.trim()) return
    setSearching(true)
    try {
      const res = await cardService.list({ search: cardSearch, limit: 10 })
      setSearchResults(res.data.data)
    } catch {
      gooeyToast.error('Tìm kiếm thất bại')
    } finally {
      setSearching(false)
    }
  }

  const addCard = async (cardId: string) => {
    if (!id) return
    try {
      await deckService.addCard(id, cardId)
      gooeyToast.success(DECK_COPY.addCardSuccess)
      reload()
    } catch {
      gooeyToast.error('Thêm thẻ thất bại')
    }
  }

  const removeCard = async (cardId: string) => {
    if (!id || !confirm(DECK_COPY.removeCardConfirm)) return
    try {
      await deckService.removeCard(id, cardId)
      gooeyToast.success(DECK_COPY.removeCardSuccess)
      reload()
    } catch {
      gooeyToast.error('Gỡ thẻ thất bại')
    }
  }

  const moveCard = async (cards: DeckCardItem[], idx: number, dir: -1 | 1) => {
    if (!id) return
    const newCards = [...cards]
    const temp = newCards[idx]
    newCards[idx] = newCards[idx + dir]
    newCards[idx + dir] = temp
    try {
      await deckService.reorderCards(id, { cardIds: newCards.map((c) => c.cardId) })
      gooeyToast.success(DECK_COPY.reorderSuccess)
      reload()
    } catch {
      gooeyToast.error('Lưu thứ tự thất bại')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-[14px] text-outline">Đang tải...</p>
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <p className="text-[14px] text-tertiary">Không tìm thấy bộ thẻ</p>
        <button onClick={() => navigate('/decks')} className="rounded-xl bg-surface-container-low px-4 py-2 text-[13px] text-outline hover:bg-accent">
          Quay lại
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Deck info form */}
      <DeckForm initial={deck} />

      {/* Card ordering panel */}
      <section className="rounded-2xl bg-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Thẻ trong bộ ({deck.cards.length})
        </h3>

        {/* Card list */}
        <div className="space-y-1.5">
          {deck.cards.length === 0 && (
            <p className="py-4 text-center text-[13px] text-outline">Bộ thẻ chưa có thẻ nào</p>
          )}
          {deck.cards.map((card, idx) => (
            <div key={card.id} className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-2.5">
              <span className="w-5 shrink-0 text-center text-[11px] font-bold text-outline">{idx + 1}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${JLPT_COLORS[card.jlptLevel].bg} ${JLPT_COLORS[card.jlptLevel].text}`}>
                {card.jlptLevel}
              </span>
              <span className="text-[11px] text-outline">{CARD_TYPE_LABELS[card.cardType]}</span>
              <span className="flex-1 text-[14px] font-medium text-on-surface" style={{ fontFamily: "'Kiwi Maru', serif" }}>
                {card.content}
              </span>
              {card.reading && <span className="text-[12px] text-on-surface-variant">{card.reading}</span>}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => moveCard(deck.cards, idx, -1)}
                  disabled={idx === 0}
                  className="flex h-6 w-6 items-center justify-center rounded text-outline hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => moveCard(deck.cards, idx, 1)}
                  disabled={idx === deck.cards.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded text-outline hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => removeCard(card.cardId)}
                  className="flex h-6 w-6 items-center justify-center rounded text-outline hover:text-tertiary"
                >
                  <Trash size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add card search */}
        <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
          <p className="text-[13px] font-medium text-on-surface-variant">Thêm thẻ vào bộ</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchCards()}
                placeholder="Tìm thẻ theo nội dung..."
                className="w-full rounded-lg border-0 bg-card py-2 pl-9 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={searchCards}
              disabled={searching}
              className="rounded-lg bg-secondary-container px-4 py-2 text-[13px] font-medium text-on-secondary-container transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {searching ? 'Đang tìm...' : 'Tìm'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-1">
              {searchResults.map((card) => (
                <div key={card.id} className="flex items-center gap-3 rounded-lg bg-card px-3 py-2">
                  <span className="text-[14px] font-medium text-on-surface" style={{ fontFamily: "'Kiwi Maru', serif" }}>
                    {card.content}
                  </span>
                  {card.reading && <span className="text-[12px] text-outline">{card.reading}</span>}
                  <span className="flex-1 text-[12px] text-on-surface-variant line-clamp-1">{card.meaning}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${JLPT_COLORS[card.jlptLevel].bg} ${JLPT_COLORS[card.jlptLevel].text}`}>
                    {card.jlptLevel}
                  </span>
                  <button
                    type="button"
                    onClick={() => addCard(card.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-outline hover:text-primary"
                  >
                    <Plus size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
