export const GreenApiMethod = {
  SendMessage: 'sendMessage',
  ReceiveNotification: 'receiveNotification',
  DeleteNotification: 'deleteNotification',
} as const

export type GreenApiMethod =
  (typeof GreenApiMethod)[keyof typeof GreenApiMethod]

export const WebhookType = {
  IncomingMessageReceived: 'incomingMessageReceived',
} as const

export type WebhookType = (typeof WebhookType)[keyof typeof WebhookType]

export const IncomingMessageType = {
  Text: 'textMessage',
} as const

export type IncomingMessageType =
  (typeof IncomingMessageType)[keyof typeof IncomingMessageType]

export const GreenApiResponseStatus = {
  Error: 'error',
} as const
