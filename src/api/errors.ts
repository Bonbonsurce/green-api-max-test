import {
  ApiErrorKind,
  type ApiErrorKind as ApiErrorKindValue,
} from '../shared/enums/api'

export class ApiError extends Error {
  readonly kind: ApiErrorKindValue
  readonly status?: number
  readonly code?: string
  readonly details?: string

  constructor(
    message: string,
    options: {
      kind?: ApiErrorKindValue
      status?: number
      code?: string
      details?: string
      cause?: unknown
    } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.kind = options.kind ?? ApiErrorKind.Unknown
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

export function mapGreenApiError(
  status: number,
  body: unknown,
  fallback: string,
): ApiError {
  const data =
    body && typeof body === 'object'
      ? (body as Record<string, unknown>)
      : undefined

  const message =
    (typeof data?.message === 'string' && data.message) ||
    (typeof data?.error === 'string' && data.error) ||
    (typeof data?.reason === 'string' && data.reason) ||
    fallback

  const code = typeof data?.code === 'string' ? data.code : undefined

  if (status === 401 || status === 403) {
    return new ApiError(message, { kind: ApiErrorKind.Auth, status, code })
  }
  if (status === 400) {
    return new ApiError(message, { kind: ApiErrorKind.Validation, status, code })
  }
  if (status >= 500) {
    return new ApiError(message, { kind: ApiErrorKind.Server, status, code })
  }

  return new ApiError(message, { kind: ApiErrorKind.Http, status, code })
}

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Произошла неизвестная ошибка'
}
