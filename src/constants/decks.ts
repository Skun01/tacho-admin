import type { DeckType } from '@/types/deck'

export const DECK_TYPE_LABELS: Record<DeckType, string> = {
  app:      'App (hệ thống)',
  textbook: 'Giáo trình',
}

export const DECKS_PER_PAGE = 20

export const DECK_COPY = {
  searchPlaceholder: 'Tìm theo tên bộ thẻ...',
  deleteConfirm:  'Bạn có chắc muốn xóa bộ thẻ này?',
  deleteSuccess:  'Đã xóa bộ thẻ',
  createSuccess:  'Đã tạo bộ thẻ mới',
  updateSuccess:  'Đã cập nhật bộ thẻ',
  addCardSuccess: 'Đã thêm thẻ vào bộ',
  removeCardConfirm: 'Gỡ thẻ này khỏi bộ?',
  removeCardSuccess: 'Đã gỡ thẻ',
  reorderSuccess: 'Đã lưu thứ tự',
} as const
