import {
  MessageDirection,
  OutgoingMessageStatus,
} from '../../shared/enums/domain'
import type { ChatMessage } from '../../types/domain'

interface MessageBubbleProps {
  message: ChatMessage
}

function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === MessageDirection.Outgoing

  return (
    <div className={`message-row ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div
        className={`message-bubble ${message.status === OutgoingMessageStatus.Failed ? 'failed' : ''}`}
      >
        <p>{message.text}</p>
        <footer className="message-meta">
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
          {isOutgoing && message.status === OutgoingMessageStatus.Sending && (
            <span className="message-status"> · отправка…</span>
          )}
          {isOutgoing && message.status === OutgoingMessageStatus.Failed && (
            <span className="message-status error"> · ошибка</span>
          )}
        </footer>
      </div>
    </div>
  )
}
