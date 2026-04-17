import api from '@/services/api'
import type { ApiResponse } from '@/types/api'
import type { AdminDeckSearchCardSummary, AdminDeckSearchCardsQuery } from '@/types/deckAdmin'

function omitNullishValues<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

export const cardSearchService = {
  search(query: AdminDeckSearchCardsQuery) {
    return api.get<ApiResponse<AdminDeckSearchCardSummary[]>>('/cards/search', {
      params: omitNullishValues({
        q: query.q,
        cardType: query.cardType,
        level: query.level,
        page: query.page,
        pageSize: query.pageSize,
      }),
    })
  },
}
