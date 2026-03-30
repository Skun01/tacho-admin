import type { CardListItem } from '@/types/card'
import type { Deck } from '@/types/deck'
import type { Comment } from '@/types/comment'
import type { SystemNotif } from '@/types/notification'
import type { AdminUser } from '@/types/user'

export const MOCK_CARDS: CardListItem[] = [
  { id: '1', type: 'vocab',   jlptLevel: 'N5', content: '食べる',   reading: 'たべる',   meaning: 'ăn',            createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', type: 'vocab',   jlptLevel: 'N5', content: '飲む',     reading: 'のむ',     meaning: 'uống',          createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', type: 'vocab',   jlptLevel: 'N4', content: '勉強する', reading: 'べんきょうする', meaning: 'học bài',   createdAt: '2024-01-03T00:00:00Z' },
  { id: '4', type: 'vocab',   jlptLevel: 'N4', content: '電車',     reading: 'でんしゃ', meaning: 'tàu điện',      createdAt: '2024-01-04T00:00:00Z' },
  { id: '5', type: 'grammar', jlptLevel: 'N5', content: '〜てください', reading: undefined,  meaning: 'Hãy làm ~', createdAt: '2024-01-05T00:00:00Z' },
  { id: '6', type: 'grammar', jlptLevel: 'N4', content: '〜ている',    reading: undefined,  meaning: 'đang ~ / trạng thái ~', createdAt: '2024-01-06T00:00:00Z' },
  { id: '7', type: 'vocab',   jlptLevel: 'N3', content: '経験',     reading: 'けいけん', meaning: 'kinh nghiệm',   createdAt: '2024-01-07T00:00:00Z' },
  { id: '8', type: 'vocab',   jlptLevel: 'N2', content: '承認',     reading: 'しょうにん', meaning: 'phê duyệt',  createdAt: '2024-01-08T00:00:00Z' },
  { id: '9', type: 'grammar', jlptLevel: 'N3', content: '〜ように',  reading: undefined,  meaning: 'để ~, sao cho ~', createdAt: '2024-01-09T00:00:00Z' },
  { id: '10', type: 'vocab',  jlptLevel: 'N1', content: '概念',     reading: 'がいねん', meaning: 'khái niệm',     createdAt: '2024-01-10T00:00:00Z' },
]

export const MOCK_DECKS: Deck[] = [
  { id: '1', title: 'Từ vựng N5 cơ bản',    description: 'Tổng hợp 100 từ vựng N5 quan trọng nhất',  deckType: 'app',      jlptLevel: 'N5', isPublic: true,  totalCards: 45, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-03-01T00:00:00Z' },
  { id: '2', title: 'Ngữ pháp N5',           description: 'Các mẫu câu ngữ pháp N5',                   deckType: 'app',      jlptLevel: 'N5', isPublic: true,  totalCards: 30, createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-03-05T00:00:00Z' },
  { id: '3', title: 'Minna no Nihongo Bài 1', description: 'Từ vựng và ngữ pháp bài 1',               deckType: 'textbook', jlptLevel: 'N5', isPublic: true,  totalCards: 22, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-03-10T00:00:00Z' },
  { id: '4', title: 'Từ vựng N4',            description: 'Tổng hợp từ vựng N4',                       deckType: 'app',      jlptLevel: 'N4', isPublic: true,  totalCards: 80, createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-03-15T00:00:00Z' },
  { id: '5', title: 'Kanji N4',              description: undefined,                                    deckType: 'app',      jlptLevel: 'N4', isPublic: false, totalCards: 60, createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-03-20T00:00:00Z' },
]

export const MOCK_COMMENTS: Comment[] = [
  { id: '1', userId: 'u1', userDisplayName: 'Nguyễn Văn A', cardId: 'c1', cardContent: '食べる', body: 'Từ này mình hay dùng khi đặt đồ ăn tại nhà hàng!', status: 'pending',  createdAt: '2024-03-20T08:00:00Z' },
  { id: '2', userId: 'u2', userDisplayName: 'Trần Thị B',   cardId: 'c2', cardContent: '飲む',   body: 'Có thể dùng cho cả uống thuốc không ạ?',          status: 'pending',  createdAt: '2024-03-21T09:15:00Z' },
  { id: '3', userId: 'u3', userDisplayName: 'Lê Văn C',     cardId: 'c5', cardContent: '〜てください', body: 'Ví dụ: 座ってください rất hay dùng trong lớp học', status: 'approved', createdAt: '2024-03-18T14:30:00Z' },
  { id: '4', userId: 'u4', userDisplayName: 'Phạm Thị D',   cardId: 'c3', cardContent: '勉強する', body: 'Mình thấy từ này cần phân biệt với 学ぶ',          status: 'pending',  createdAt: '2024-03-22T10:00:00Z' },
  { id: '5', userId: 'u5', userDisplayName: 'Hoàng Minh E', cardId: 'c7', cardContent: '経験',   body: 'Spam test 123',                                    status: 'rejected', createdAt: '2024-03-15T11:00:00Z' },
]

export const MOCK_NOTIFICATIONS: SystemNotif[] = [
  { id: '1', title: 'Chào mừng người dùng mới!', body: 'Cảm ơn bạn đã tham gia Tacho. Hãy bắt đầu học ngay hôm nay!', type: 'system', targetScope: 'all', isRead: false, createdAt: '2024-03-01T00:00:00Z' },
  { id: '2', title: 'Bộ thẻ N4 mới ra mắt',     body: 'Bộ thẻ từ vựng N4 vừa được cập nhật với 80 thẻ mới.',         type: 'system', targetScope: 'all', isRead: false, createdAt: '2024-03-10T00:00:00Z' },
  { id: '3', title: 'Nhắc nhở học hàng ngày',   body: 'Bạn có 15 thẻ cần ôn tập hôm nay. Đừng bỏ lỡ!',             type: 'reminder', targetScope: 'all', isRead: false, createdAt: '2024-03-20T00:00:00Z' },
]

export const MOCK_USERS: AdminUser[] = [
  { id: 'u1', email: 'nguyen.a@example.com', displayName: 'Nguyễn Văn A', role: 'user',   isBanned: false, createdAt: '2024-01-10T00:00:00Z', lastActiveAt: '2024-03-28T12:00:00Z' },
  { id: 'u2', email: 'tran.b@example.com',   displayName: 'Trần Thị B',   role: 'user',   isBanned: false, createdAt: '2024-01-15T00:00:00Z', lastActiveAt: '2024-03-27T08:00:00Z' },
  { id: 'u3', email: 'editor@tacho.dev',     displayName: 'Editor Tacho', role: 'editor', isBanned: false, createdAt: '2024-02-01T00:00:00Z', lastActiveAt: '2024-03-29T15:00:00Z' },
  { id: 'u4', email: 'pham.d@example.com',   displayName: 'Phạm Thị D',   role: 'user',   isBanned: true,  createdAt: '2024-02-20T00:00:00Z', lastActiveAt: '2024-03-10T09:00:00Z' },
  { id: 'u5', email: 'hoang.e@example.com',  displayName: 'Hoàng Minh E', role: 'user',   isBanned: false, createdAt: '2024-03-01T00:00:00Z', lastActiveAt: '2024-03-30T07:00:00Z' },
  { id: 'u6', email: 'admin@tacho.dev',      displayName: 'Admin Dev',    role: 'admin',  isBanned: false, createdAt: '2024-01-01T00:00:00Z', lastActiveAt: '2024-03-30T14:00:00Z' },
]
