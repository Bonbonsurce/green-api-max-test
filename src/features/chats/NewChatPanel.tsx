import { useState, type FormEvent } from 'react'
import { phoneToChatId } from '../../shared/utils/phone'

interface NewChatPanelProps {
  onCreate: (phone: string, chatId: string) => void
  onCancel: () => void
}

export function NewChatPanel({ onCreate, onCancel }: NewChatPanelProps) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const chatId = phoneToChatId(phone)
      onCreate(phone.trim(), chatId)
      setPhone('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Некорректный номер')
    }
  }

  return (
    <form className="new-chat-panel" onSubmit={handleSubmit}>
      <p className="new-chat-hint">
        Введите номер получателя (например +79991234567) или chatId из MAX
      </p>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+7 999 123-45-67"
        autoFocus
      />
      {error && <p className="inline-error">{error}</p>}
      <div className="new-chat-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Создать чат
        </button>
      </div>
    </form>
  )
}
