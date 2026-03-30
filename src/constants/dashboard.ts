export const DASHBOARD_COPY = {
  pageTitle: 'Dashboard',
  statsSection: 'Tổng quan',
  jlptSection: 'Phân bổ theo JLPT',
  dailyUsersSection: 'Người dùng hoạt động (30 ngày)',
  cardTypeSection: 'Phân loại thẻ',
} as const

export const STAT_CARDS = [
  {
    id: 'totalCards',
    label: 'TỔNG SỐ THẺ',
    delta: 'Vocab + Grammar',
    color: 'primary' as const,
  },
  {
    id: 'totalDecks',
    label: 'BỘ THẺ HỆ THỐNG',
    delta: 'App + Textbook',
    color: 'secondary' as const,
  },
  {
    id: 'totalUsers',
    label: 'NGƯỜI DÙNG',
    delta: '30 ngày qua',
    deltaKey: 'activeUsersLast30d',
    color: 'primary' as const,
  },
  {
    id: 'totalComments',
    label: 'BÌNH LUẬN',
    delta: 'Tổng cộng',
    color: 'secondary' as const,
  },
] as const

export const JLPT_COLORS = {
  vocab:   '#466906',
  grammar: '#005971',
} as const
