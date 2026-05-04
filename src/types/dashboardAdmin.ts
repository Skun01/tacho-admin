// ────────────────────────────────────────────────
// Admin dashboard summary responses
// ────────────────────────────────────────────────

export interface ContentSummaryResponse {
  vocabularyCount: number
  grammarCount: number
  kanjiCount: number
  deckCount: number
}

export interface UserSummaryResponse {
  totalUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  activeUsersToday: number
}
