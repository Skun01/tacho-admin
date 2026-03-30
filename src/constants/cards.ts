import type { CardType, JlptLevel, GrammarRegister } from '@/types/card'

export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  vocab: 'Từ vựng',
  grammar: 'Ngữ pháp',
}

export const JLPT_COLORS: Record<JlptLevel, { bg: string; text: string }> = {
  N5: { bg: 'bg-primary-container',   text: 'text-on-primary-container' },
  N4: { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  N3: { bg: 'bg-warning-container',   text: 'text-on-warning-container' },
  N2: { bg: 'bg-tertiary-container',  text: 'text-on-tertiary-container' },
  N1: { bg: 'bg-accent',              text: 'text-on-surface-variant' },
}

export const GRAMMAR_REGISTER_LABELS: Record<GrammarRegister, string> = {
  casual:   'Thông thường',
  standard: 'Trung lập',
  polite:   'Lịch sự',
  formal:   'Trang trọng',
}

export const PART_OF_SPEECH_OPTIONS = [
  '名詞 (Danh từ)',
  '動詞 (Động từ)',
  'い形容詞 (Tính từ -i)',
  'な形容詞 (Tính từ -na)',
  '副詞 (Trạng từ)',
  '助詞 (Trợ từ)',
  '接続詞 (Liên từ)',
  '感動詞 (Thán từ)',
  '助動詞 (Trợ động từ)',
  '接頭辞 (Tiền tố)',
  '接尾辞 (Hậu tố)',
  '数詞 (Số từ)',
]

export const CARDS_PER_PAGE = 20

export const CARD_COPY = {
  listTitle: 'Quản lý Thẻ',
  createVocabTitle: 'Tạo Thẻ Từ vựng',
  createGrammarTitle: 'Tạo Thẻ Ngữ pháp',
  editTitle: 'Chỉnh sửa Thẻ',
  deleteConfirm: 'Bạn có chắc muốn xóa thẻ này?',
  restoreConfirm: 'Khôi phục thẻ này?',
  deleteSuccess: 'Đã xóa thẻ',
  restoreSuccess: 'Đã khôi phục thẻ',
  createSuccess: 'Đã tạo thẻ mới',
  updateSuccess: 'Đã cập nhật thẻ',
  searchPlaceholder: 'Tìm theo nội dung, reading...',
  noResults: 'Không tìm thấy thẻ nào',
} as const
