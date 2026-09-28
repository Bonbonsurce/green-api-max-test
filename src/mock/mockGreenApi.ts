import { ApiErrorKind } from '../shared/enums/api'
import {
  IncomingMessageType,
  WebhookType,
} from '../shared/enums/green-api'
import { MessageLimit, MockTiming, Polling } from '../shared/constants/app'
import { ApiError } from '../api/errors'
import type {
  ReceiveNotificationResponse,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/green-api'
import { MOCK_AUTO_REPLIES } from './data'

type NotificationBody = ReceiveNotificationResponse['body']

interface QueuedNotification {
  receiptId: number
  body: NotificationBody
}

const queues = new Map<string, QueuedNotification[]>()
let receiptCounter = 1

function getQueue(idInstance: string): QueuedNotification[] {
  let queue = queues.get(idInstance)
  if (!queue) {
    queue = []
    queues.set(idInstance, queue)
  }
  return queue
}

function scheduleAutoReply(
  idInstance: string,
  chatId: string,
  userText: string,
): void {
  const delayMs =
    MockTiming.ReplyMinMs +
    Math.random() * (MockTiming.ReplyMaxMs - MockTiming.ReplyMinMs)
  const replyText =
    MOCK_AUTO_REPLIES[Math.floor(Math.random() * MOCK_AUTO_REPLIES.length)] ??
    'OK'
  const preview = userText.slice(0, MessageLimit.PreviewLength)
  const ellipsis = userText.length > MessageLimit.PreviewLength ? '…' : ''

  window.setTimeout(() => {
    getQueue(idInstance).push({
      receiptId: receiptCounter++,
      body: {
        typeWebhook: WebhookType.IncomingMessageReceived,
        timestamp: Math.floor(Date.now() / 1000),
        idMessage: String(Date.now()),
        senderData: {
          chatId,
          sender: chatId,
          senderName: 'Собеседник (mock)',
        },
        messageData: {
          typeMessage: IncomingMessageType.Text,
          textMessageData: {
            textMessage: `${replyText} (на: «${preview}${ellipsis}»)`,
          },
        },
      },
    })
  }, delayMs)
}

export async function mockSendMessage(
  idInstance: string,
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  if (!payload.chatId?.trim()) {
    throw new ApiError('Укажите chatId', { kind: ApiErrorKind.Validation })
  }
  if (!payload.message?.trim()) {
    throw new ApiError('Текст сообщения не может быть пустым', {
      kind: ApiErrorKind.Validation,
    })
  }
  if (payload.message.length > MessageLimit.MaxTextLength) {
    throw new ApiError(
      `Сообщение длиннее ${MessageLimit.MaxTextLength} символов`,
      { kind: ApiErrorKind.Validation },
    )
  }

  await delay(MockTiming.SendDelayMs)
  scheduleAutoReply(idInstance, payload.chatId, payload.message)

  return { idMessage: String(Date.now()) }
}

export async function mockReceiveNotification(
  idInstance: string,
  receiveTimeout: number = Polling.ReceiveTimeoutSec,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const deadline = Date.now() + receiveTimeout * 1000
  const queue = getQueue(idInstance)

  while (Date.now() < deadline) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }
    if (queue.length > 0) {
      const next = queue.shift()!
      return { receiptId: next.receiptId, body: next.body }
    }
    await delay(Polling.MockPollIntervalMs)
  }

  return null
}

export async function mockDeleteNotification(
  idInstance: string,
  receiptId: number,
): Promise<{ result: boolean }> {
  await delay(MockTiming.DeleteDelayMs)
  const queue = getQueue(idInstance)
  const index = queue.findIndex((item) => item.receiptId === receiptId)
  if (index >= 0) {
    queue.splice(index, 1)
  }
  return { result: true }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
