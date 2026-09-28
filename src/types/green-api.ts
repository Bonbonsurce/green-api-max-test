import {
  GreenApiResponseStatus,
  type IncomingMessageType,
  type WebhookType,
} from '../shared/enums/green-api'

export interface SendMessagePayload {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: IncomingNotificationBody
}

export interface IncomingNotificationBody {
  typeWebhook: WebhookType | string
  timestamp?: number
  idMessage?: string
  senderData?: {
    chatId?: string
    sender?: string
    senderName?: string
  }
  messageData?: {
    typeMessage?: IncomingMessageType | string
    textMessageData?: {
      textMessage?: string
    }
  }
}

export interface DeleteNotificationResponse {
  result: boolean
}

export interface GreenApiErrorBody {
  status?: typeof GreenApiResponseStatus.Error
  code?: string
  message?: string
  error?: string
  reason?: string
}
