const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//i

function getApiOrigin() {
  if (typeof window === 'undefined') {
    return ''
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

  try {
    const resolvedBase = new URL(apiBaseUrl, window.location.origin)
    return `${resolvedBase.protocol}//${resolvedBase.host}`
  } catch {
    return window.location.origin
  }
}

export function resolveApiMediaUrl(rawUrl?: string | null) {
  if (!rawUrl) {
    return null
  }

  const url = rawUrl.trim()
  if (!url) {
    return null
  }

  if (url.startsWith('data:') || url.startsWith('blob:') || ABSOLUTE_URL_PATTERN.test(url)) {
    return url
  }

  const apiOrigin = getApiOrigin()
  if (!apiOrigin) {
    return url
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  return `${apiOrigin}${normalizedPath}`
}
