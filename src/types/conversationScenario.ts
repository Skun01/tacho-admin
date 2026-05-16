export interface ConversationScenarioResponse {
  id: string
  name: string
  icon: string
  description: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string | null
}

export interface CreateConversationScenarioPayload {
  name: string
  icon: string
  description: string
  isActive: boolean
  sortOrder: number
}

export interface UpdateConversationScenarioPayload {
  name?: string
  icon?: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}
