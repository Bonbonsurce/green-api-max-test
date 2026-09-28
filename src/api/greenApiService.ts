import * as mock from '../mock/mockGreenApi'
import type { GreenApiCredentials } from '../types/domain'
import type {
  ReceiveNotificationResponse,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/green-api'
import * as real from './greenApi'

export async function sendMessage(
  credentials: GreenApiCredentials,
  payload: SendMessagePayload,
  signal?: AbortSignal,
): Promise<SendMessageResponse> {
  if (credentials.useMock) {
    return mock.mockSendMessage(credentials.idInstance, payload)
  }
  return real.sendMessage(credentials, payload, signal)
}

export async function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeout?: number,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  if (credentials.useMock) {
    return mock.mockReceiveNotification(
      credentials.idInstance,
      receiveTimeout,
      signal,
    )
  }
  return real.receiveNotification(credentials, receiveTimeout, signal)
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<{ result: boolean }> {
  if (credentials.useMock) {
    return mock.mockDeleteNotification(credentials.idInstance, receiptId)
  }
  return real.deleteNotification(credentials, receiptId, signal)
}
