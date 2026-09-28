import type { Chat } from '../../types/domain'

interface ChatSidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onNewChat: () => void
  useMock: boolean
  receiveError: string | null
  onDismissReceiveError: () => void
  onLogout: () => void
}

export function ChatSidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  useMock,
  receiveError,
  onDismissReceiveError,
  onLogout,
}: ChatSidebarProps) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h2>Чаты</h2>
        {useMock && <span className="badge-mock">Demo</span>}
      </header>

      <button type="button" className="btn-new-chat" onClick={onNewChat}>
        + Новый чат
      </button>

      <ul className="chat-list">
        {sorted.length === 0 && (
          <li className="chat-list-empty">
            Создайте чат по номеру телефона получателя
          </li>
        )}
        {sorted.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              className={`chat-list-item${activeChatId === chat.id ? ' active' : ''}`}
              onClick={() => onSelect(chat.id)}
            >
              <span className="chat-avatar" aria-hidden>
                {chat.title.slice(0, 1).toUpperCase()}
              </span>
              <span className="chat-list-body">
                <span className="chat-list-title">{chat.title}</span>
                {chat.lastMessage && (
                  <span className="chat-list-preview">{chat.lastMessage}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {receiveError && (
        <div className="sidebar-notice" role="alert">
          <p>{receiveError}</p>
          <button type="button" className="notice-dismiss" onClick={onDismissReceiveError}>
            Закрыть
          </button>
        </div>
      )}

      <footer className="sidebar-footer">
        <button type="button" className="btn-ghost btn-logout" onClick={onLogout}>
          Сменить учётные данные
        </button>
      </footer>
    </aside>
  )
}
