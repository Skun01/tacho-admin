import { ADMIN_COMMON_CONTENT } from '@/constants/adminContent'

function splitCodeAndField(errorCode: string) {
  const [code, fieldPath] = errorCode.split(':')
  return { code, fieldPath }
}

export function getImportIssueMessage(issueCode: string) {
  const { code, fieldPath } = splitCodeAndField(issueCode)
  const mapped = ADMIN_COMMON_CONTENT.importErrorByCode[code as keyof typeof ADMIN_COMMON_CONTENT.importErrorByCode]
  if (mapped) {
    return fieldPath ? `${mapped} (${fieldPath})` : mapped
  }

  return fieldPath
    ? ADMIN_COMMON_CONTENT.importErrorUnknownFieldLabel(fieldPath)
    : ADMIN_COMMON_CONTENT.importErrorFallbackLabel
}
