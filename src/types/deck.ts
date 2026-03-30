import type { JlptLevel } from './card'

export type DeckType = 'app' | 'textbook'

export interface DeckCardItem {
  id: string
  cardId: string
  content: string
  reading?: string
  meaning: string
  cardType: 'vocab' | 'grammar'
  jlptLevel: JlptLevel
  position: number
}

export interface Deck {
  id: string
  title: string
  description?: string
  deckType: DeckType
  jlptLevel?: JlptLevel
  isPublic: boolean
  coverUrl?: string
  totalCards: number
  createdAt: string
  updatedAt: string
}

export interface DeckDetail extends Deck {
  cards: DeckCardItem[]
}

export interface CreateDeckDTO {
  title: string
  description?: string
  deckType: DeckType
  jlptLevel?: JlptLevel
  isPublic?: boolean
}

export interface ReorderCardsDTO {
  cardIds: string[]
}
