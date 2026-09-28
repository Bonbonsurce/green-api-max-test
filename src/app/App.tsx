import { CredentialsForm } from '../features/auth/CredentialsForm'
import { ChatSidebar } from '../features/chats/ChatSidebar'
import { NewChatPanel } from '../features/chats/NewChatPanel'
import { ChatPanel } from '../features/messages/ChatPanel'
import { useChatSession } from '../hooks/useChatSession'
import '../styles/app.css'

export default function App() {
  const session = useChatSession()

  if (!session.credentials) {
    return <CredentialsForm onSubmit={session.login} />
  }

  return (
    <div className="app-shell">
      <ChatSidebar
        chats={session.chats}
        activeChatId={session.activeChatId}
        onSelect={session.setActiveChatId}
        onNewChat={session.openNewChat}
        useMock={session.credentials.useMock}
        receiveError={session.receiveError}
        onDismissReceiveError={session.dismissReceiveError}
        onLogout={session.logout}
      />

      <div className="main-column">
        {session.showNewChat && (
          <div className="overlay-panel">
            <NewChatPanel
              onCreate={session.createChatByPhone}
              onCancel={session.closeNewChat}
            />
          </div>
        )}

        <ChatPanel
          chat={session.activeChat}
          messages={session.activeMessages}
          sendError={session.sendError}
          onDismissSendError={session.dismissSendError}
          sending={session.sending}
          onSend={session.sendChatMessage}
          onNewChat={session.openNewChat}
        />
      </div>
    </div>
  )
}
