interface ApiErrorData {
  code?: string | null
}

const API_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  CONFLICT: 'Dữ liệu bị xung đột. Vui lòng tải lại và thử lại.',
}

export function getSafeApiErrorMessage(error: unknown, fallback: string) {
  const typed = error as {
    apiData?: ApiErrorData
    response?: { data?: ApiErrorData }
  }

  const code = typed?.apiData?.code ?? typed?.response?.data?.code
  if (code && API_ERROR_MESSAGE_BY_CODE[code]) {
    return API_ERROR_MESSAGE_BY_CODE[code]
  }

  return fallback
}