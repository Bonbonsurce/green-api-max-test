import { MOCK_CREDENTIALS } from '../../mock/data'
import type { GreenApiCredentials } from '../../types/domain'
import { normalizeApiUrl } from './apiUrl'

export function resolveLoginCredentials(
  input: GreenApiCredentials,
): GreenApiCredentials {
  const base = {
    ...input,
    idInstance: input.idInstance.trim(),
    apiTokenInstance: input.apiTokenInstance.trim(),
    apiUrl: normalizeApiUrl(input.apiUrl),
  }

  if (!input.useMock) {
    return base
  }

  return {
    ...MOCK_CREDENTIALS,
    ...base,
    idInstance: base.idInstance || MOCK_CREDENTIALS.idInstance,
    apiTokenInstance:
      base.apiTokenInstance || MOCK_CREDENTIALS.apiTokenInstance,
  }
}

export function validateCredentials(credentials: GreenApiCredentials): string | null {
  if (credentials.useMock) {
    return null
  }
  if (!credentials.idInstance.trim() || !credentials.apiTokenInstance.trim()) {
    return 'Заполните idInstance и apiTokenInstance'
  }
  return null
}
