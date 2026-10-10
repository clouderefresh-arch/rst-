# ООО «РТК» — лендинг

Одностраничный сайт сервисной и торговой компании: ремонт автотранспорта и поставка запчастей. Подольск, Климовск, доставка по РФ.

## Стек

Next.js (App Router), TypeScript, Tailwind CSS, lucide-react.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Продакшен-сборка: `npm run build && npm run start`.

## Заявки в Telegram

Форма отправляет `POST /api/lead` с полями `name`, `phone`, `carInfo`, `serviceType`, `comment`.

В `.env.local`:

- `TELEGRAM_BOT_TOKEN` — токен бота
- `TELEGRAM_CHAT_ID` — чат дежурного мастера

Бот должен иметь право писать в указанный чат. Без переменных API отвечает ошибкой, страница при этом открывается.
