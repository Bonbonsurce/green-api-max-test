import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { MessageLimit } from '../../shared/constants/app'

interface MessageComposerProps {
  disabled?: boolean
  onSend: (text: string) => void
}

export function MessageComposer({ disabled, onSend }: MessageComposerProps) {
  const [text, setText] = useState('')

  function submit() {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    if (trimmed.length > MessageLimit.MaxTextLength) return
    onSend(trimmed)
    setText('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        rows={1}
        maxLength={MessageLimit.MaxTextLength}
        disabled={disabled}
      />
      <button
        type="submit"
        className="btn-send"
        disabled={disabled || !text.trim()}
        aria-label="Отправить"
      >
        ➤
      </button>
    </form>
  )
}
