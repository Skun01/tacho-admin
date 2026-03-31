import { create } from 'zustand'
import type { Example, CreateExampleDTO } from '@/types/example'
import { MOCK_EXAMPLES } from '@/mocks/examples'

interface ExampleStore {
  examples: Example[]
  add: (dto: CreateExampleDTO) => Example
  update: (id: string, dto: Partial<CreateExampleDTO>) => void
  remove: (id: string) => void
}

export const useExampleStore = create<ExampleStore>((set, get) => ({
  examples: MOCK_EXAMPLES,

  add: (dto) => {
    const newEx: Example = {
      ...dto,
      id: `ex-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set({ examples: [newEx, ...get().examples] })
    return newEx
  },

  update: (id, dto) => {
    set({
      examples: get().examples.map((ex) =>
        ex.id === id ? { ...ex, ...dto } : ex
      ),
    })
  },

  remove: (id) => {
    set({ examples: get().examples.filter((ex) => ex.id !== id) })
  },
}))
