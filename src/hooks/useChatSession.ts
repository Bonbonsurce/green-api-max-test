import { useCallback, useEffect, useMemo, useState } from 'react'
import { sendMessage } from '../api/greenApiService'
import { toUserMessage } from '../api/errors'
import {
  MessageDirection,
  OutgoingMessageStatus,
} from '../shared/enums'
import {
  addChatIfMissing,
  createChat,
  findChatByApiId,
  touchChatPreview,
} from '../shared/utils/chat'
import {
  clearCredentials,
  loadChats,
  loadCredentials,
  loadMessages,
  patchMessageInStore,
  saveChats,
  saveCredentials,
  saveMessages,
  upsertMessageInStore,
} from '../shared/utils/storage'
import type {
  Chat,
  ChatMessage,
  GreenApiCredentials,
  IncomingTextMessage,
  MessagesByChatId,
} from '../types/domain'
import { useNotificationPolling } from './useNotificationPolling'

export function useChatSession() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    () => loadCredentials(),
  )
  const [chats, setChats] = useState<Chat[]>(() => loadChats())
  const [messagesByChat, setMessagesByChat] = useState<MessagesByChatId>(
    () => loadMessages(),
  )
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const stored = loadChats()
    return stored[0]?.id ?? null
  })
  const [showNewChat, setShowNewChat] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [receiveError, setReceiveError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [chats, activeChatId],
  )

  const activeMessages = useMemo(() => {
    if (!activeChat) return []
    return messagesByChat[activeChat.chatId] ?? []
  }, [activeChat, messagesByChat])

  useEffect(() => {
    saveChats(chats)
  }, [chats])

  useEffect(() => {
    saveMessages(messagesByChat)
  }, [messagesByChat])

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessagesByChat((prev) => upsertMessageInStore(prev, message))
    setChats((prev) =>
      touchChatPreview(prev, message.chatId, message.text, message.timestamp),
    )
  }, [])

  const handleIncoming = useCallback(
    (payload: IncomingTextMessage) => {
      setChats((prev) => addChatIfMissing(prev, payload.chatId))
      appendMessage({
        id: payload.idMessage,
        chatId: payload.chatId,
        text: payload.text,
        direction: MessageDirection.Incoming,
        timestamp: payload.timestamp,
      })
      setReceiveError(null)
    },
    [appendMessage],
  )

  const handlePollingError = useCallback((message: string) => {
    setReceiveError(message)
  }, [])

  useNotificationPolling({
    credentials,
    onIncoming: handleIncoming,
    onPollingError: handlePollingError,
  })

  const login = useCallback((next: GreenApiCredentials) => {
    saveCredentials(next)
    setCredentials(next)
    setSendError(null)
    setReceiveError(null)
  }, [])

  const logout = useCallback(() => {
    clearCredentials()
    setCredentials(null)
    setActiveChatId(null)
    setSendError(null)
    setReceiveError(null)
  }, [])

  const openNewChat = useCallback(() => setShowNewChat(true), [])
  const closeNewChat = useCallback(() => setShowNewChat(false), [])

  const createChatByPhone = useCallback((phone: string, chatId: string) => {
    let nextActiveId = chatId

    setChats((prev) => {
      const existing = findChatByApiId(prev, chatId)
      if (existing) {
        nextActiveId = existing.id
        return prev
      }
      nextActiveId = chatId
      return [...prev, createChat(phone, chatId)]
    })

    setActiveChatId(nextActiveId)
    setShowNewChat(false)
    setSendError(null)
  }, [])

  const sendChatMessage = useCallback(
    async (text: string) => {
      if (!credentials || !activeChat) return

      const localId = `local-${Date.now()}`
      appendMessage({
        id: localId,
        chatId: activeChat.chatId,
        text,
        direction: MessageDirection.Outgoing,
        timestamp: Date.now(),
        status: OutgoingMessageStatus.Sending,
      })

      setSending(true)
      setSendError(null)

      try {
        const response = await sendMessage(credentials, {
          chatId: activeChat.chatId,
          message: text,
        })
        setMessagesByChat((prev) =>
          patchMessageInStore(prev, activeChat.chatId, localId, {
            id: response.idMessage,
            status: OutgoingMessageStatus.Sent,
          }),
        )
      } catch (error) {
        setMessagesByChat((prev) =>
          patchMessageInStore(prev, activeChat.chatId, localId, {
            status: OutgoingMessageStatus.Failed,
          }),
        )
        setSendError(toUserMessage(error))
      } finally {
        setSending(false)
      }
    },
    [activeChat, appendMessage, credentials],
  )

  const dismissSendError = useCallback(() => setSendError(null), [])
  const dismissReceiveError = useCallback(() => setReceiveError(null), [])

  return {
    credentials,
    chats,
    activeChatId,
    activeChat,
    activeMessages,
    showNewChat,
    sendError,
    receiveError,
    sending,
    setActiveChatId,
    login,
    logout,
    openNewChat,
    closeNewChat,
    createChatByPhone,
    sendChatMessage,
    dismissSendError,
    dismissReceiveError,
  }
}
