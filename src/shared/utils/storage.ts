import { StorageKey } from '../constants/app'
import type {
  Chat,
  ChatMessage,
  GreenApiCredentials,
  MessagesByChatId,
} from '../../types/domain'

function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadCredentials(): GreenApiCredentials | null {
  try {
    const raw = sessionStorage.getItem(StorageKey.Credentials)
    if (!raw) return null
    return JSON.parse(raw) as GreenApiCredentials
  } catch {
    return null
  }
}

export function saveCredentials(credentials: GreenApiCredentials): void {
  sessionStorage.setItem(StorageKey.Credentials, JSON.stringify(credentials))
}

export function clearCredentials(): void {
  sessionStorage.removeItem(StorageKey.Credentials)
}

export function loadChats(): Chat[] {
  return readLocalJson<Chat[]>(StorageKey.Chats, [])
}

export function saveChats(chats: Chat[]): void {
  localStorage.setItem(StorageKey.Chats, JSON.stringify(chats))
}

export function loadMessages(): MessagesByChatId {
  return readLocalJson<MessagesByChatId>(StorageKey.Messages, {})
}

export function saveMessages(messages: MessagesByChatId): void {
  localStorage.setItem(StorageKey.Messages, JSON.stringify(messages))
}

export function upsertMessageInStore(
  store: MessagesByChatId,
  message: ChatMessage,
): MessagesByChatId {
  const list = store[message.chatId] ?? []
  if (list.some((item) => item.id === message.id)) {
    return store
  }
  return { ...store, [message.chatId]: [...list, message] }
}

export function patchMessageInStore(
  store: MessagesByChatId,
  chatId: string,
  messageId: string,
  patch: Partial<ChatMessage>,
): MessagesByChatId {
  const list = store[chatId] ?? []
  return {
    ...store,
    [chatId]: list.map((item) =>
      item.id === messageId ? { ...item, ...patch } : item,
    ),
  }
}
