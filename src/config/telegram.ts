/**
 * Заявки с формы сайта уходят в Telegram.
 *
 * Вставьте свои данные, сохраните файл и перезапустите сайт на сервере:
 * systemctl restart rtk
 * Файл читается при работе сервера, пересобирать проект не нужно.
 *
 * TELEGRAM_BOT_TOKEN — токен бота от @BotFather.
 * Пример: 123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * TELEGRAM_CHAT_ID — куда бот пишет заявки.
 * Для группы id обычно начинается с минуса, например -1001234567890.
 * Личный id можно узнать у @userinfobot или командой /start этому боту.
 *
 * TELEGRAM_ALLOWED_USER_IDS — кто может смотреть заявки, сортировать их
 * и менять статус. Один id на строку, в кавычках. Пустые строки можно не трогать.
 * Если список пустой, управлять заявками можно только в чате TELEGRAM_CHAT_ID.
 *
 * TELEGRAM_NOTIFY_USER_IDS — кому ещё присылать карточку заявки личным сообщением.
 * Человек должен сначала написать боту /start. Основной TELEGRAM_CHAT_ID тоже получает заявку.
 *
 * Напоминания приходят, пока статус заявки не «Обработана».
 * TELEGRAM_REMINDER_AFTER_MINUTES — через сколько минут напомнить в первый раз.
 * TELEGRAM_REMINDER_REPEAT_MINUTES — как часто повторять.
 * TELEGRAM_REMINDER_MAX_DAYS — сколько дней повторять. 0 = без ограничения.
 *
 * Если в .env.local заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID, они важнее этого файла.
 * Не публикуйте настоящий токен.
 */
export const TELEGRAM_BOT_TOKEN = "";
export const TELEGRAM_CHAT_ID = "";

export const TELEGRAM_ALLOWED_USER_IDS = [
  "",
  "",
  "",
  "",
  "",
  "",
];

export const TELEGRAM_NOTIFY_USER_IDS = [
  "",
];

export const TELEGRAM_REMINDER_AFTER_MINUTES = 30;
export const TELEGRAM_REMINDER_REPEAT_MINUTES = 60;
export const TELEGRAM_REMINDER_MAX_DAYS = 7;
