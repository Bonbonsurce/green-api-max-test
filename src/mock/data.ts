import { GREEN_API_DEFAULT_URL } from '../shared/constants/green-api'
import type { GreenApiCredentials } from '../types/domain'

export const MOCK_CREDENTIALS: GreenApiCredentials = {
  idInstance: '3100000001',
  apiTokenInstance: 'mock-demo-token-green-api',
  apiUrl: GREEN_API_DEFAULT_URL,
  useMock: true,
}

export const MOCK_AUTO_REPLIES = [
  'Привет! Это тестовый ответ из MAX (mock).',
  'Сообщение получено 👍',
  'Спасибо за сообщение!',
  'Да, я здесь. Это демо-режим без реального аккаунта.',
]
