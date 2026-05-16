export const CONVERSATION_SCENARIO_CONTENT = {
  pageTitle: 'Kịch bản hội thoại',
  heading: 'Quản lý kịch bản hội thoại',
  description: 'Quản lý các kịch bản hội thoại cho người dùng luyện tập giao tiếp.',

  columns: {
    icon: 'Icon',
    name: 'Tên kịch bản',
    description: 'Mô tả',
    sortOrder: 'Thứ tự',
    status: 'Trạng thái',
    actions: 'Thao tác',
  },

  status: {
    active: 'Đang hoạt động',
    inactive: 'Ẩn',
  },

  actions: {
    create: 'Thêm kịch bản',
    edit: 'Sửa',
    delete: 'Xóa',
    toggleActive: 'Đổi trạng thái',
  },

  toast: {
    createSuccess: 'Tạo kịch bản thành công',
    updateSuccess: 'Cập nhật kịch bản thành công',
    deleteSuccess: 'Xóa kịch bản thành công',
    createError: 'Không thể tạo kịch bản',
    updateError: 'Không thể cập nhật kịch bản',
    deleteError: 'Không thể xóa kịch bản',
  },

  form: {
    createTitle: 'Thêm kịch bản mới',
    createDescription: 'Tạo kịch bản hội thoại mới cho người dùng luyện tập.',
    editTitle: 'Sửa kịch bản',
    editDescription: 'Cập nhật thông tin kịch bản hội thoại.',
    nameLabel: 'Tên kịch bản',
    namePlaceholder: 'Ví dụ: Đặt phòng khách sạn',
    iconLabel: 'Icon',
    iconPlaceholder: 'Chọn icon cho kịch bản',
    descriptionLabel: 'Mô tả',
    descriptionPlaceholder: 'Mô tả ngắn gọn về kịch bản...',
    sortOrderLabel: 'Thứ tự hiển thị',
    sortOrderPlaceholder: '0',
    isActiveLabel: 'Trạng thái hoạt động',
    isActiveDescription: 'Kịch bản sẽ hiển thị cho người dùng khi được bật.',
    cancelLabel: 'Hủy',
    createConfirmLabel: 'Tạo kịch bản',
    saveLabel: 'Lưu thay đổi',
  },

  confirmDelete: {
    title: 'Xác nhận xóa kịch bản',
    description: (name: string) => `Bạn có chắc chắn muốn xóa kịch bản "${name}"? Hành động này không thể hoàn tác.`,
    confirm: 'Xóa',
    cancel: 'Hủy',
  },

  empty: {
    title: 'Chưa có kịch bản nào',
    description: 'Bắt đầu bằng cách thêm kịch bản hội thoại đầu tiên.',
  },
} as const

export const CONVERSATION_SCENARIO_ERROR_MESSAGES: Record<string, string> = {
  ConversationScenario_NotFound_404: 'Không tìm thấy kịch bản.',
  ConversationScenario_InUse_400: 'Không thể xóa kịch bản đang được sử dụng.',
  Validation_400: 'Dữ liệu không hợp lệ.',
}
