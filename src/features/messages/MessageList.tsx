import { useEffect, useMemo, useRef } from 'react'
import type { ChatMessage } from '../../types/domain'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const sorted = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sorted])

  return (
    <div className="message-list">
      {sorted.length === 0 && (
        <p className="message-list-empty">Напишите первое сообщение</p>
      )}
      {sorted.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
