export const MessageDirection = {
  Incoming: 'incoming',
  Outgoing: 'outgoing',
} as const

export type MessageDirection =
  (typeof MessageDirection)[keyof typeof MessageDirection]

export const OutgoingMessageStatus = {
  Sending: 'sending',
  Sent: 'sent',
  Failed: 'failed',
} as const

export type OutgoingMessageStatus =
  (typeof OutgoingMessageStatus)[keyof typeof OutgoingMessageStatus]
