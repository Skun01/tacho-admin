export interface AdminStats {
  totalCards: number
  vocabCards: number
  grammarCards: number
  totalDecks: number
  appDecks: number
  textbookDecks: number
  totalUsers: number
  activeUsersLast30d: number
  totalComments: number
}

export interface JlptDistribution {
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  vocab: number
  grammar: number
}

export interface DailyActiveUser {
  date: string
  count: number
}

export interface AdminDashboard {
  stats: AdminStats
  jlptDistribution: JlptDistribution[]
  dailyActiveUsers: DailyActiveUser[]
}
