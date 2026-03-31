export type CardType = 'vocab' | 'grammar'
export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
export type GrammarRegister = 'casual' | 'standard' | 'polite' | 'formal'

export interface CardExample {
  id?: string
  japaneseSentence: string
  vietnameseMeaning: string
  audioUrl?: string
  jlptLevel?: JlptLevel
  isAboutExample?: boolean
  hiddenPart?: string
  hint?: string
  visibleHint?: string
  alternativeAnswers?: string[]
  position: number
}

export interface DictDefinition {
  id?: string
  definition: string
  position: number
}

export interface DictEntry {
  id?: string
  partOfSpeech: string
  definitions: DictDefinition[]
  position: number
}

export interface GrammarLink {
  id?: string
  linkedCardId: string
  linkedCardContent?: string
  linkType: 'antonym' | 'related'
}

export interface CardReference {
  id?: string
  title: string
  url: string
}

export interface BaseCard {
  id: string
  type: CardType
  jlptLevel: JlptLevel
  content: string
  meaning: string
  createdAt: string
  deletedAt?: string | null
}

export interface VocabCard extends BaseCard {
  type: 'vocab'
  reading: string
  exampleSentence?: string
  exampleMeaning?: string
  audioUrl?: string
  pitchAccent?: string
  pitchPattern?: number[]
  acceptedReadings: string[]
  dictEntries: DictEntry[]
  examples: CardExample[]
}

export interface GrammarCard extends BaseCard {
  type: 'grammar'
  structure?: string
  formalVariant?: string
  register?: GrammarRegister
  aboutText?: string
  notes?: string
  examples: CardExample[]
  grammarLinks: GrammarLink[]
  references: CardReference[]
}

export type AnyCard = VocabCard | GrammarCard

export interface CardListItem {
  id: string
  type: CardType
  jlptLevel: JlptLevel
  content: string
  reading?: string
  meaning: string
  createdAt: string
  deletedAt?: string | null
}

export interface CreateVocabCardDTO {
  jlptLevel: JlptLevel
  content: string
  reading: string
  meaning: string
  exampleSentence?: string
  exampleMeaning?: string
  audioUrl?: string
  pitchAccent?: string
  pitchPattern?: number[]
  acceptedReadings?: string[]
  examples?: Omit<CardExample, 'id'>[]
  dictEntries?: { partOfSpeech: string; definitions: string[]; position: number }[]
}

export interface CreateGrammarCardDTO {
  jlptLevel: JlptLevel
  content: string
  meaning: string
  structure?: string
  formalVariant?: string
  register?: GrammarRegister
  aboutText?: string
  notes?: string
  examples?: Omit<CardExample, 'id'>[]
}
