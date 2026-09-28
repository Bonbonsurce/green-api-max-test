import type { Chat, ChatMessage } from '../../types/domain'
import { MessageList } from './MessageList'
import { MessageComposer } from './MessageComposer'

interface ChatPanelProps {
  chat: Chat | null
  messages: ChatMessage[]
  sendError: string | null
  onDismissSendError: () => void
  sending: boolean
  onSend: (text: string) => void
  onNewChat: () => void
}

export function ChatPanel({
  chat,
  messages,
  sendError,
  onDismissSendError,
  sending,
  onSend,
  onNewChat,
}: ChatPanelProps) {
  if (!chat) {
    return (
      <main className="chat-panel chat-panel--empty">
        <div className="empty-state">
          <p>Выберите чат слева или создайте новый</p>
          <button type="button" className="btn-primary" onClick={onNewChat}>
            Новый чат
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="chat-panel">
      <header className="chat-header">
        <div className="chat-header-avatar" aria-hidden>
          {chat.title.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h3>{chat.title}</h3>
          <p className="chat-header-sub">{chat.chatId}</p>
        </div>
      </header>

      {sendError && (
        <div className="api-error-banner" role="alert">
          <span>{sendError}</span>
          <button type="button" className="notice-dismiss" onClick={onDismissSendError}>
            Закрыть
          </button>
        </div>
      )}

      <MessageList messages={messages} />
      <MessageComposer disabled={sending} onSend={onSend} />
    </main>
  )
}
