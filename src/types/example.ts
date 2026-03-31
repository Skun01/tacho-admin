import type { JlptLevel } from './card'

export interface Example {
  id: string
  japaneseSentence: string
  vietnameseMeaning: string
  audioUrl?: string
  jlptLevel?: JlptLevel
  createdAt: string
}

export interface CreateExampleDTO {
  japaneseSentence: string
  vietnameseMeaning: string
  audioUrl?: string
  jlptLevel?: JlptLevel
}
