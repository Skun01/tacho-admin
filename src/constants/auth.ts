export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Login
  'Email_NotFound_404': 'Email không tồn tại trong hệ thống.',
  'Password_Wrong_401': 'Mật khẩu không chính xác.',
  // Password
  'CurrentPassword_Wrong_401': 'Mật khẩu hiện tại không đúng.',
  'ResetToken_Invalid_400': 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
  // General
  'Validation_400': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  'default': 'Đã có lỗi xảy ra. Vui lòng thử lại.',
}

export const AUTH_LOGIN_COPY = {
  heading: 'Quản trị viên',
  subheading: 'Đăng nhập để tiếp tục vào hệ thống quản trị.',
  emailLabel: 'Email',
  emailPlaceholder: 'admin@tacho.app',
  passwordLabel: 'Mật khẩu',
  passwordPlaceholder: '••••••••',
  submitButton: 'Đăng nhập',
  loadingButton: 'Đang đăng nhập...',
  forgotPassword: 'Quên mật khẩu?',
} as const

export const AUTH_FORGOT_PASSWORD_COPY = {
  heading: 'Khôi phục mật khẩu',
  subheading: 'Nhập email để nhận liên kết đặt lại mật khẩu.',
  emailLabel: 'Email',
  emailPlaceholder: 'admin@tacho.app',
  submitButton: 'Gửi liên kết',
  loadingButton: 'Đang gửi...',
  successHeading: 'Email đã được gửi',
  successMessage: 'Kiểm tra hộp thư của bạn để đặt lại mật khẩu.',
  backToLogin: 'Quay lại đăng nhập',
} as const

export const AUTH_RESET_PASSWORD_COPY = {
  heading: 'Đặt lại mật khẩu',
  subheading: 'Tạo mật khẩu mới cho tài khoản của bạn.',
  newPasswordLabel: 'Mật khẩu mới',
  newPasswordPlaceholder: '••••••••',
  submitButton: 'Đặt lại mật khẩu',
  loadingButton: 'Đang xử lý...',
  backToLogin: 'Quay lại đăng nhập',
} as const

export const AUTH_PROFILE_COPY = {
  profileSection: 'Thông tin tài khoản',
  securitySection: 'Bảo mật',
  displayNameLabel: 'Tên hiển thị',
  displayNamePlaceholder: 'Nguyễn Văn A',
  avatarUrlLabel: 'Ảnh đại diện (URL)',
  avatarUrlPlaceholder: 'https://...',
  saveProfileButton: 'Lưu thay đổi',
  currentPasswordLabel: 'Mật khẩu hiện tại',
  newPasswordLabel: 'Mật khẩu mới',
  confirmNewPasswordLabel: 'Xác nhận mật khẩu mới',
  changePasswordButton: 'Đổi mật khẩu',
} as const
