import { PhoneRules } from '../constants/app'

export function phoneToChatId(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('Укажите номер телефона или chatId')
  }

  if (trimmed.includes('@')) {
    return trimmed
  }

  if (
    /^\d+$/.test(trimmed) &&
    trimmed.length <= PhoneRules.MaxNumericChatIdDigits
  ) {
    return trimmed
  }

  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < PhoneRules.MinDigits) {
    throw new Error('Номер телефона слишком короткий')
  }

  let normalized = digits
  if (normalized.length === 11 && normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`
  } else if (normalized.length === 10) {
    normalized = `7${normalized}`
  }

  return `${normalized}${PhoneRules.ChatIdSuffix}`
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
  }
  return phone
}

export function chatIdToTitle(chatId: string, phone: string): string {
  if (phone.trim()) {
    return formatPhoneDisplay(phone)
  }
  return chatId.replace(/@c\.us$/, '')
}
