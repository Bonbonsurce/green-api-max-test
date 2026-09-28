export const StorageKey = {
  Credentials: 'max-chat:credentials',
  Chats: 'max-chat:chats',
  Messages: 'max-chat:messages',
} as const

export const MessageLimit = {
  MaxTextLength: 4000,
  PreviewLength: 40,
} as const

export const Polling = {
  ReceiveTimeoutSec: 5,
  ErrorRetryMs: 3000,
  MockPollIntervalMs: 200,
} as const

export const MockTiming = {
  SendDelayMs: 300,
  DeleteDelayMs: 100,
  ReplyMinMs: 1500,
  ReplyMaxMs: 4000,
} as const

export const PhoneRules = {
  MinDigits: 10,
  MaxNumericChatIdDigits: 9,
  ChatIdSuffix: '@c.us',
} as const
