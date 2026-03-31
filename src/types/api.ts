export interface ApiResponse<T> {
  code: number
  success: boolean
  message: string | null
  data: T
  metaData: PaginatedMeta | null
}

export interface PaginatedMeta {
  total: number
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metaData: PaginatedMeta
}

export const API_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  EMAIL_ALREADY_EXISTS: 'Email này đã được sử dụng.',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  INTERNAL_SERVER_ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  Invalid_400: 'Email hoặc mật khẩu không đúng.',
  Email_Exist_409: 'Email này đã được sử dụng.',
  Token_Expired_409: 'Liên kết hoặc phiên làm việc đã hết hạn.',
  Common_401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  Common_404: 'Không tìm thấy dữ liệu.',
  Common_400: 'Dữ liệu không hợp lệ.',
  Wrong_Current_Password_400: 'Mật khẩu hiện tại không đúng.',
  Validation_400: 'Dữ liệu nhập chưa hợp lệ.',
}
