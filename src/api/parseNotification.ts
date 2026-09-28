import {
  IncomingMessageType,
  WebhookType,
} from '../shared/enums/green-api'
import type { IncomingTextMessage } from '../types/domain'
import type { IncomingNotificationBody } from '../types/green-api'

export function parseIncomingTextMessage(
  body: IncomingNotificationBody,
): IncomingTextMessage | null {
  if (body.typeWebhook !== WebhookType.IncomingMessageReceived) {
    return null
  }

  if (body.messageData?.typeMessage !== IncomingMessageType.Text) {
    return null
  }

  const text = body.messageData.textMessageData?.textMessage?.trim()
  const chatId = body.senderData?.chatId

  if (!text || !chatId) {
    return null
  }

  const timestampSec = body.timestamp ?? Math.floor(Date.now() / 1000)

  return {
    chatId,
    text,
    idMessage: body.idMessage ?? String(timestampSec),
    timestamp: timestampSec * 1000,
  }
}
