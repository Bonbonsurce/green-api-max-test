import {
  GREEN_API_DEFAULT_URL,
  GREEN_API_DEV_PROXY_PATH,
  GREEN_API_HOST_SUFFIX,
} from '../constants/green-api'

export function normalizeApiUrl(input: string): string {
  const trimmed = input.trim() || GREEN_API_DEFAULT_URL
  return trimmed.replace(/\/$/, '')
}

export function resolveApiBase(apiUrl: string): string {
  const normalized = normalizeApiUrl(apiUrl)

  if (!import.meta.env.DEV || import.meta.env.VITE_GREEN_API_PROXY !== 'true') {
    return normalized
  }

  try {
    const { hostname } = new URL(normalized)
    if (hostname.endsWith(GREEN_API_HOST_SUFFIX)) {
      return GREEN_API_DEV_PROXY_PATH
    }
  } catch {
    return normalized
  }

  return normalized
}

export { GREEN_API_DEFAULT_URL as DEFAULT_API_URL }
