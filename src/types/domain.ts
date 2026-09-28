import type {
  MessageDirection,
  OutgoingMessageStatus,
} from '../shared/enums/domain'

export type { MessageDirection, OutgoingMessageStatus }

export interface ChatMessage {
  id: string
  chatId: string
  text: string
  direction: MessageDirection
  timestamp: number
  status?: OutgoingMessageStatus
}

export interface Chat {
  id: string
  chatId: string
  title: string
  phone: string
  lastMessage?: string
  updatedAt: number
}

export interface GreenApiCredentials {
  idInstance: string
  apiTokenInstance: string
  apiUrl: string
  useMock: boolean
}

export interface IncomingTextMessage {
  chatId: string
  text: string
  idMessage: string
  timestamp: number
}

export type MessagesByChatId = Record<string, ChatMessage[]>
