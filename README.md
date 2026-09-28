# MAX Chat · тестовое задание (React)

Веб-чат для **текстовых** сообщений MAX через [GREEN-API](https://green-api.com/max). Интерфейс: список чатов + переписка (ориентир — [web.max.ru](https://web.max.ru/)).

## Сценарий (как в ТЗ)

1. Ввести `idInstance` и `apiTokenInstance` (и при необходимости `apiUrl`) из личного кабинета GREEN-API  
2. Создать чат по номеру телефона получателя  
3. Отправить текст → [`SendMessage`](https://green-api.com/v3/docs/api/sending/SendMessage/)  
4. Получить ответ → [`ReceiveNotification`](https://green-api.com/en/docs/api/receiving/technology-http-api/ReceiveNotification/) + [`DeleteNotification`](https://green-api.com/en/docs/api/receiving/technology-http-api/DeleteNotification/)

## Demo без MAX

```bash
cp .env.example .env   # VITE_USE_MOCK=true
npm install
npm run dev
```

**Войти** (demo включён) → **Новый чат** → `+79991234567` → отправить сообщение → через 1.5–4 с придёт mock-ответ.

## Боевой режим

- Выключить «Демо без MAX», указать данные инстанса из [консоли](https://console.green-api.com/)  
- У инстанса: пустой `webhookUrl`, входящие через HTTP API  
- В dev: `VITE_GREEN_API_PROXY=true` в `.env` (прокси Vite, обход CORS)

## Архитектура

```
src/
  api/                 HTTP-клиент, GREEN-API, разбор webhook
  app/App.tsx          сборка экранов
  features/            UI: auth, chats, messages
  hooks/
    useChatSession.ts  состояние приложения
    useNotificationPolling.ts
  mock/                эмулятор API для demo
  shared/
    constants/         лимиты, ключи storage, polling
    enums/             MessageDirection, WebhookType, ApiErrorKind…
    utils/
  types/               domain + контракт GREEN-API
  styles/
```

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | разработка |
| `npm run build` | production |
| `npm run lint` | ESLint |
