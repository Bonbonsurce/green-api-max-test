import { useState, type FormEvent } from 'react'
import type { GreenApiCredentials } from '../../types/domain'
import { DEFAULT_API_URL, normalizeApiUrl } from '../../shared/utils/apiUrl'
import {
  resolveLoginCredentials,
  validateCredentials,
} from '../../shared/utils/credentials'
import { MOCK_CREDENTIALS } from '../../mock/data'

interface CredentialsFormProps {
  onSubmit: (credentials: GreenApiCredentials) => void
}

export function CredentialsForm({ onSubmit }: CredentialsFormProps) {
  const defaultMock = import.meta.env.VITE_USE_MOCK === 'true'

  const [idInstance, setIdInstance] = useState(
    defaultMock ? MOCK_CREDENTIALS.idInstance : '',
  )
  const [apiTokenInstance, setApiTokenInstance] = useState(
    defaultMock ? MOCK_CREDENTIALS.apiTokenInstance : '',
  )
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [useMock, setUseMock] = useState(defaultMock)
  const [formError, setFormError] = useState<string | null>(null)

  function fillMockDemo() {
    setIdInstance(MOCK_CREDENTIALS.idInstance)
    setApiTokenInstance(MOCK_CREDENTIALS.apiTokenInstance)
    setApiUrl(MOCK_CREDENTIALS.apiUrl)
    setUseMock(true)
    setFormError(null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const draft: GreenApiCredentials = {
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
      apiUrl: normalizeApiUrl(apiUrl),
      useMock,
    }

    const resolved = resolveLoginCredentials(draft)
    const validationError = validateCredentials(resolved)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)
    onSubmit(resolved)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo" aria-hidden>
            M
          </span>
          <div>
            <h1>MAX Chat</h1>
            <p className="auth-subtitle">
              GREEN-API · текстовые сообщения
            </p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {formError && (
            <div className="form-error-banner" role="alert">
              {formError}
            </div>
          )}

          <label>
            idInstance
            <input
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="3100000001"
              required={!useMock}
              autoComplete="off"
            />
          </label>

          <label>
            apiTokenInstance
            <input
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              placeholder="ключ из личного кабинета"
              required={!useMock}
              type="password"
              autoComplete="off"
            />
          </label>

          <label>
            apiUrl
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder={DEFAULT_API_URL}
              disabled={useMock}
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
            />
            Демо без MAX (mock GREEN-API)
          </label>

          <div className="auth-actions">
            <button type="button" className="btn-secondary" onClick={fillMockDemo}>
              Тестовые данные
            </button>
            <button type="submit" className="btn-primary">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
