interface ApiErrorData {
  code?: string | number | null
  message?: string | null
}

const API_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  CONFLICT: 'Dữ liệu bị xung đột. Vui lòng tải lại và thử lại.',
}

export function getSafeApiErrorMessage(
  error: unknown,
  fallback: string,
  messageByCode?: Record<string, string>,
) {
  const typed = error as {
    apiData?: ApiErrorData
    response?: { data?: ApiErrorData }
  }

  const businessMessage = typed?.apiData?.message ?? typed?.response?.data?.message
  if (businessMessage && messageByCode?.[businessMessage]) {
    return messageByCode[businessMessage]
  }

  const code = typed?.apiData?.code ?? typed?.response?.data?.code
  const normalizedCode = typeof code === 'number' ? String(code) : code
  if (normalizedCode && messageByCode?.[normalizedCode]) {
    return messageByCode[normalizedCode]
  }

  if (normalizedCode && API_ERROR_MESSAGE_BY_CODE[normalizedCode]) {
    return API_ERROR_MESSAGE_BY_CODE[normalizedCode]
  }

  return fallback
}
