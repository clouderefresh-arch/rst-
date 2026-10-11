# ООО «РТК» — лендинг

Одностраничный сайт сервисной и торговой компании: ремонт автотранспорта и поставка запчастей. Подольск, Климовск, доставка по РФ.

## Стек

Next.js (App Router), TypeScript, Tailwind CSS, lucide-react.

## Запуск

```bash
npm install
npm run dev
```

Продакшен-сборка: `npm run build && npm run start`.

## Заявки в Telegram

Форма отправляет `POST /api/lead` с полями `name`, `phone`, `carInfo`, `serviceType`, `comment`.

Откройте `src/config/telegram.ts` и вставьте между кавычками:

- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
- `TELEGRAM_CHAT_ID` — id чата, куда бот пишет заявки

Сохраните файл и перезапустите сайт. Бот должен иметь право писать в этот чат.

Те же значения можно задать в `.env.local` (скопируйте `.env.example`). Если они заданы, они важнее файла. Без токена и id страница открывается, а форма отвечает ошибкой.
