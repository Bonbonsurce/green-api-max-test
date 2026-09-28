export const ApiErrorKind = {
  Network: 'network',
  Http: 'http',
  Validation: 'validation',
  Auth: 'auth',
  Forbidden: 'forbidden',
  Server: 'server',
  Parse: 'parse',
  Unknown: 'unknown',
} as const

export type ApiErrorKind = (typeof ApiErrorKind)[keyof typeof ApiErrorKind]

export const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Delete: 'DELETE',
} as const

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]
