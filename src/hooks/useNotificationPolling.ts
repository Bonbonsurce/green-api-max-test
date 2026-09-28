import { useEffect } from 'react'
import {
  deleteNotification,
  receiveNotification,
} from '../api/greenApiService'
import { parseIncomingTextMessage } from '../api/parseNotification'
import { toUserMessage } from '../api/errors'
import { Polling } from '../shared/constants/app'
import type { GreenApiCredentials, IncomingTextMessage } from '../types/domain'

interface UseNotificationPollingOptions {
  credentials: GreenApiCredentials | null
  onIncoming: (message: IncomingTextMessage) => void
  onPollingError: (message: string) => void
}

export function useNotificationPolling({
  credentials,
  onIncoming,
  onPollingError,
}: UseNotificationPollingOptions): void {
  useEffect(() => {
    if (!credentials) return

    const abort = new AbortController()
    let running = true

    async function pollLoop(): Promise<void> {
      while (running && !abort.signal.aborted) {
        try {
          const notification = await receiveNotification(
            credentials!,
            Polling.ReceiveTimeoutSec,
            abort.signal,
          )

          if (notification) {
            const parsed = parseIncomingTextMessage(notification.body)
            if (parsed) {
              onIncoming(parsed)
            }
            await deleteNotification(
              credentials!,
              notification.receiptId,
              abort.signal,
            )
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            break
          }
          onPollingError(toUserMessage(error))
          await sleep(Polling.ErrorRetryMs)
        }
      }
    }

    void pollLoop()

    return () => {
      running = false
      abort.abort()
    }
  }, [credentials, onIncoming, onPollingError])
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
