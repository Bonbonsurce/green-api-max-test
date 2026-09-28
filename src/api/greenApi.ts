import { HttpMethod } from '../shared/enums'
import {
  GreenApiMethod,
  type GreenApiMethod as GreenApiMethodName,
} from '../shared/enums/green-api'
import { GREEN_API_INSTANCE_PREFIX } from '../shared/constants/green-api'
import { Polling } from '../shared/constants/app'
import { resolveApiBase } from '../shared/utils/apiUrl'
import type { GreenApiCredentials } from '../types/domain'
import type {
  DeleteNotificationResponse,
  ReceiveNotificationResponse,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/green-api'
import { apiRequest } from './client'

function buildInstanceUrl(
  credentials: GreenApiCredentials,
  method: GreenApiMethodName,
  ...extraPath: string[]
): string {
  const base = resolveApiBase(credentials.apiUrl)
  const suffix = extraPath.length ? `/${extraPath.join('/')}` : ''
  return `${base}/${GREEN_API_INSTANCE_PREFIX}${credentials.idInstance}/${method}/${credentials.apiTokenInstance}${suffix}`
}

export async function sendMessage(
  credentials: GreenApiCredentials,
  payload: SendMessagePayload,
  signal?: AbortSignal,
): Promise<SendMessageResponse> {
  const result = await apiRequest<SendMessageResponse>(
    buildInstanceUrl(credentials, GreenApiMethod.SendMessage),
    { method: HttpMethod.Post, body: payload, signal },
  )
  if (!result?.idMessage) {
    throw new Error('Сервер не вернул idMessage')
  }
  return result
}

export async function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeout: number = Polling.ReceiveTimeoutSec,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${buildInstanceUrl(credentials, GreenApiMethod.ReceiveNotification)}?receiveTimeout=${receiveTimeout}`
  return apiRequest<ReceiveNotificationResponse>(url, { signal })
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<DeleteNotificationResponse> {
  const result = await apiRequest<DeleteNotificationResponse>(
    buildInstanceUrl(
      credentials,
      GreenApiMethod.DeleteNotification,
      String(receiptId),
    ),
    { method: HttpMethod.Delete, signal },
  )
  return result ?? { result: true }
}
