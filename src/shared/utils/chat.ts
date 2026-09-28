import type { Chat } from '../../types/domain'
import { chatIdToTitle } from './phone'

export function createChat(phone: string, chatId: string): Chat {
  const now = Date.now()
  return {
    id: chatId,
    chatId,
    phone,
    title: chatIdToTitle(chatId, phone),
    updatedAt: now,
  }
}

export function touchChatPreview(
  chats: Chat[],
  chatId: string,
  text: string,
  timestamp: number,
): Chat[] {
  return chats.map((chat) =>
    chat.chatId === chatId
      ? { ...chat, lastMessage: text, updatedAt: timestamp }
      : chat,
  )
}

export function findChatByApiId(chats: Chat[], chatId: string): Chat | undefined {
  return chats.find((chat) => chat.chatId === chatId)
}

export function addChatIfMissing(chats: Chat[], chatId: string): Chat[] {
  if (findChatByApiId(chats, chatId)) {
    return chats
  }
  return [...chats, createChat('', chatId)]
}
