import type { ShadowingLevel, ShadowingStatus, ShadowingVisibility } from '@/types/shadowingAdmin'

// ── Error Messages ───────────────────────────────────────────────────────────

export const SHADOWING_ADMIN_ERROR_MESSAGES: Record<string, string> = {
  Shadowing_TopicNotFound_404: 'Không tìm thấy chủ đề luyện phát âm.',
  Shadowing_SentenceNotFound_404: 'Không tìm thấy câu luyện tập.',
  Shadowing_SentenceAlreadyAttached_400: 'Câu này đã được thêm vào chủ đề rồi.',
  Shadowing_SentenceNotAttached_404: 'Câu này chưa được thêm vào chủ đề.',
  Shadowing_DuplicatePosition_400: 'Vị trí bị trùng lặp. Vui lòng kiểm tra lại.',
  Shadowing_InvalidAudio_400: 'File âm thanh không hợp lệ.',
  Shadowing_AssessmentFailed_500: 'Không thể đánh giá phát âm.',
  Validation_400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  default: 'Không thể xử lý thao tác. Vui lòng thử lại.',
}

// ── Status Labels ────────────────────────────────────────────────────────────

export const SHADOWING_STATUS_LABELS: Record<ShadowingStatus, string> = {
  Draft: 'Lưu nháp',
  Published: 'Xuất bản',
  Archived: 'Lưu trữ',
}

export const SHADOWING_STATUS_DESCRIPTIONS: Record<ShadowingStatus, string> = {
  Draft: 'Lưu nội dung để tiếp tục biên tập trước khi public.',
  Published: 'Cho phép người dùng xem và luyện tập.',
  Archived: 'Ẩn khỏi luồng hoạt động chính nhưng vẫn giữ dữ liệu.',
}

// ── Visibility Labels ─────────────────────────────────────────────────────────

export const SHADOWING_VISIBILITY_LABELS: Record<ShadowingVisibility, string> = {
  Public: 'Công khai',
  Private: 'Riêng tư',
}

// ── Level Labels ───────────────────────────────────────────────────────────

export const SHADOWING_LEVEL_LABELS: Record<ShadowingLevel, string> = {
  N1: 'N1',
  N2: 'N2',
  N3: 'N3',
  N4: 'N4',
  N5: 'N5',
}

// ── Page Content ─────────────────────────────────────────────────────────────

export const SHADOWING_ADMIN_CONTENT = {
  pageTitle: 'Quản lý Shadowing | Tacho Admin',
  heading: 'Quản lý chủ đề luyện phát âm',
  description: 'Tạo và quản lý các chủ đề luyện phát âm tiếng Nhật, thêm câu vào chủ đề, xem analytics.',
  searchPlaceholder: 'Tìm theo tiêu đề hoặc mô tả chủ đề...',
  createLabel: 'Tạo chủ đề',
  tableTitle: 'Danh sách chủ đề',
  emptyTitle: 'Không có chủ đề phù hợp',
  emptyDescription: 'Hãy thử đổi bộ lọc hoặc tạo một chủ đề mới.',
  emptyActionLabel: 'Tạo chủ đề',
  resultCountLabel: (count: number) => `${count} chủ đề`,
  filterTitle: 'Bộ lọc chủ đề',
  filterButtonLabel: 'Bộ lọc',
  filterDescription: 'Lọc theo trạng thái, hiển thị, cấp độ và cờ hệ thống.',
  activeFilterSummaryLabel: (count: number) => `${count} bộ lọc đang bật`,
  levelFilterPlaceholder: 'Chọn cấp độ',
  statusFilterPlaceholder: 'Chọn trạng thái',
  visibilityFilterPlaceholder: 'Chọn hiển thị',
  officialOnlyLabel: 'Chỉ hiện chủ đề hệ thống',
  resetFiltersLabel: 'Xóa lọc',
  searchLabel: 'Tìm kiếm',
  allOptionLabel: 'Tất cả',
  previousPageLabel: 'Trang trước',
  nextPageLabel: 'Trang sau',
  paginationLabel: (currentPage: number, totalPage: number) => `Trang ${currentPage} / ${totalPage}`,
  columns: {
    title: 'Chủ đề',
    level: 'Cấp độ',
    owner: 'Người tạo',
    status: 'Trạng thái',
    visibility: 'Hiển thị',
    official: 'Hệ thống',
    sentencesCount: 'Số câu',
    updatedAt: 'Cập nhật',
    actions: 'Thao tác',
  },
  statusActions: {
    publish: 'Phát hành',
    unpublish: 'Chuyển về nháp',
    archive: 'Lưu trữ',
  },
  actions: {
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    openDetail: 'Mở trình chỉnh sửa',
  },

  // ── Detail Page ────────────────────────────────────────────────────────────
  detailPageTitle: 'Chi tiết chủ đề',
  backToList: 'Quay lại danh sách',
  topicInfo: 'Thông tin chủ đề',
  basicInfoTab: 'Thông tin cơ bản',
  sentencesTab: 'Quản lý câu',
  analyticsTab: 'Thống kê',

  // ── Sentences Management ───────────────────────────────────────────────────
  sentencesSectionTitle: 'Danh sách câu trong chủ đề',
  addSentenceLabel: 'Thêm câu',
  addBulkSentencesLabel: 'Thêm nhiều câu',
  reorderSentencesLabel: 'Sắp xếp lại',
  searchAvailableSentencesPlaceholder: 'Tìm kiếm câu có sẵn...',
  sentencePositionColumn: 'Vị trí',
  sentenceTextColumn: 'Câu tiếng Nhật',
  sentenceMeaningColumn: 'Nghĩa',
  sentenceLevelColumn: 'Cấp độ',
  sentenceNoteColumn: 'Ghi chú',
  sentenceActionsColumn: 'Thao tác',
  editSentenceLabel: 'Sửa',
  removeSentenceLabel: 'Xóa',
  alreadyAttachedLabel: 'Đã thêm',
  attachLabel: 'Thêm vào chủ đề',

  // ── Topic Form ─────────────────────────────────────────────────────────────
  createTopicTitle: 'Tạo chủ đề mới',
  createTopicDescription: 'Tạo một chủ đề luyện phát âm mới',
  editTopicTitle: 'Chỉnh sửa chủ đề',
  editTopicDescription: 'Chỉnh sửa thông tin chủ đề',
  titleFieldLabel: 'Tiêu đề',
  titleFieldPlaceholder: 'Nhập tiêu đề chủ đề',
  descriptionFieldLabel: 'Mô tả',
  descriptionFieldPlaceholder: 'Nhập mô tả chủ đề',
  coverImageUrlFieldLabel: 'URL ảnh bìa',
  coverImageUrlFieldPlaceholder: 'https://example.com/image.webp',
  coverImageFileFieldLabel: 'Ảnh bìa',
  coverImageUploadHint: 'Khuyên dùng file JPG, PNG, WEBP (tối đa 2MB).',
  levelFieldLabel: 'Cấp độ JLPT',
  levelEmptyOptionLabel: 'Không chọn cấp độ',
  visibilityFieldLabel: 'Hiển thị',
  statusFieldLabel: 'Trạng thái',
  cancelLabel: 'Hủy',
  saveLabel: 'Lưu',
  createConfirmLabel: 'Tạo chủ đề',
  savingLabel: 'Đang lưu...',
  creatingLabel: 'Đang tạo...',

  // ── Analytics ──────────────────────────────────────────────────────────────
  analyticsSectionTitle: 'Thống kê sử dụng',
  totalAttemptsLabel: 'Tổng lượt luyện tập',
  distinctUsersLabel: 'Số người dùng',
  averageScoreLabel: 'Điểm trung bình',
  latestAttemptLabel: 'Luyện tập gần nhất',
  sentenceAnalyticsTitle: 'Thống kê theo câu',
  positionColumn: 'Vị trí',
  attemptsColumn: 'Lượt thử',
  usersColumn: 'Người dùng',
  avgScoreColumn: 'Điểm TB',
  noDataLabel: 'Chưa có dữ liệu',

  // ── Confirmations ───────────────────────────────────────────────────────────
  deleteTopicConfirmTitle: 'Xác nhận xóa chủ đề',
  deleteTopicConfirmMessage: 'Bạn có chắc muốn xóa chủ đề này? Thao tác này không thể hoàn tác.',
  deleteSentenceConfirmTitle: 'Xác nhận xóa câu',
  deleteSentenceConfirmMessage: 'Bạn có chắc muốn xóa câu này khỏi chủ đề?',
  addSentenceDescription: 'Chọn câu từ danh sách có sẵn để thêm vào chủ đề',
  addSentenceDialogTitle: 'Thêm câu',
  emptyAvailableSentencesLabel: 'Không tìm thấy câu phù hợp',
  emptyTopicSentencesLabel: 'Chưa có câu nào trong chủ đề này',
  topicInfoIdLabel: 'ID',
  topicInfoOfficialLabel: 'Loại chủ đề',
  topicInfoOfficialBadgeLabel: 'Hệ thống',
  topicInfoRegularBadgeLabel: 'Tự tạo',
  topicInfoUpdatedAtLabel: 'Cập nhật',
  topicInfoYesLabel: 'Có',
  topicInfoNoLabel: 'Không',
  sentenceAnalyticsTextColumn: 'Câu',
  topicInfoDescriptionLabel: 'Mô tả',
  noneSymbol: '-',
  confirmDeleteLabel: 'Xóa',
  confirmCancelLabel: 'Hủy',

  // ── Toast Messages ───────────────────────────────────────────────────────────
  topicCreatedSuccess: 'Đã tạo chủ đề thành công!',
  topicUpdatedSuccess: 'Đã cập nhật chủ đề thành công!',
  topicDeletedSuccess: 'Đã xóa chủ đề thành công!',
  sentenceAttachedSuccess: 'Đã thêm câu vào chủ đề!',
  sentenceRemovedSuccess: 'Đã xóa câu khỏi chủ đề!',
  sentencesReorderedSuccess: 'Đã sắp xếp lại câu thành công!',
  createTopicFailedFallback: 'Không thể tạo chủ đề',
  updateTopicFailedFallback: 'Không thể cập nhật chủ đề',
  deleteSentenceFailedFallback: 'Không thể xóa câu',
  attachSentenceFailedFallback: 'Không thể thêm câu',
} as const
