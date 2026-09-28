import { ApiErrorKind, HttpMethod } from '../shared/enums/api'
import { GreenApiResponseStatus } from '../shared/enums/green-api'
import { ApiError, mapGreenApiError } from './errors'
import type { GreenApiErrorBody } from '../types/green-api'

interface RequestOptions {
  method?: (typeof HttpMethod)[keyof typeof HttpMethod]
  body?: unknown
  signal?: AbortSignal
}

function isErrorPayload(value: unknown): value is GreenApiErrorBody {
  if (!value || typeof value !== 'object') return false
  const obj = value as GreenApiErrorBody
  return (
    obj.status === GreenApiResponseStatus.Error ||
    Boolean(obj.code && obj.message)
  )
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T | null> {
  const { method = HttpMethod.Get, body, signal } = options

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }
    throw new ApiError('Нет соединения с сервером GREEN-API', {
      kind: ApiErrorKind.Network,
      cause,
    })
  }

  const rawText = await response.text()
  let parsed: unknown = null

  if (rawText.trim()) {
    try {
      parsed = JSON.parse(rawText) as unknown
    } catch (cause) {
      throw new ApiError('Сервер вернул некорректный JSON', {
        kind: ApiErrorKind.Parse,
        status: response.status,
        cause,
      })
    }
  }

  if (!response.ok) {
    throw mapGreenApiError(
      response.status,
      parsed,
      `Ошибка запроса (${response.status})`,
    )
  }

  if (parsed && isErrorPayload(parsed)) {
    throw new ApiError(parsed.message ?? 'Ошибка GREEN-API', {
      kind: ApiErrorKind.Validation,
      status: response.status,
      code: parsed.code,
    })
  }

  if (parsed === null || (typeof parsed === 'object' && Object.keys(parsed).length === 0)) {
    return null
  }

  return parsed as T
}
