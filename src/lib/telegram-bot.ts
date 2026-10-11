import { escapeHtml, type LeadInput } from "@/lib/lead";
import {
  leadStore,
  leadsDueForReminder,
  sortLeads,
  type LeadStatus,
  type SortMode,
  type StoredLead,
} from "@/lib/lead-store";
import { chatLooksValid, readTelegramSettings, tokenLooksValid, type TelegramSettings } from "@/lib/telegram-settings";
import { telegramRequest } from "@/lib/telegram-fetch";

const PAGE_SIZE = 6;

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новая",
  progress: "В работе",
  done: "Обработана",
};

const SORT_LABEL: Record<SortMode, string> = {
  date_desc: "сначала новые",
  date_asc: "сначала старые",
  status: "по статусу",
  service: "по услуге",
  open: "только не обработанные",
};

const SORT_CODE: Record<string, SortMode> = {
  D: "date_desc",
  A: "date_asc",
  S: "status",
  U: "service",
  O: "open",
};

const CODE_SORT: Record<SortMode, string> = {
  date_desc: "D",
  date_asc: "A",
  status: "S",
  service: "U",
  open: "O",
};

const STATUS_CODE: Record<string, LeadStatus> = {
  n: "new",
  p: "progress",
  d: "done",
};

type TelegramMessage = {
  message_id: number;
  chat: { id: number; type: string };
  text?: string;
  from?: { id: number };
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    data?: string;
    from: { id: number };
    message?: TelegramMessage;
  };
};

type InlineKeyboard = {
  inline_keyboard: { text: string; callback_data: string }[][];
};

let resolvedChatId = "";
let polling = false;
let reminding = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callTelegram<T>(token: string, method: string, body: Record<string, unknown>): Promise<{ ok: boolean; result?: T; description?: string }> {
  try {
    return await telegramRequest<T>(token, method, body, method === "getUpdates" ? 40_000 : 12_000);
  } catch (error) {
    console.error("Telegram API unreachable", error instanceof Error ? error.message : "unknown");
    return { ok: false };
  }
}

function when(stamp: number): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(stamp);
}

export function cardText(lead: StoredLead): string {
  return [
    `<b>Заявка №${lead.id} — ООО «РТК»</b>`,
    `Статус: <b>${STATUS_LABEL[lead.status]}</b>`,
    `Дата: ${escapeHtml(when(lead.createdAt))} (МСК)`,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Авто / VIN:</b> ${escapeHtml(lead.carInfo || "—")}`,
    `<b>Услуга:</b> ${escapeHtml(lead.serviceType || "—")}`,
    `<b>Комментарий:</b> ${escapeHtml(lead.comment || "—")}`,
  ].join("\n");
}

function cardKeyboard(lead: StoredLead): InlineKeyboard {
  const actions: { text: string; callback_data: string }[] = [];
  if (lead.status !== "progress") actions.push({ text: "В работе", callback_data: `T:${lead.id}:p` });
  if (lead.status !== "done") actions.push({ text: "Обработана", callback_data: `T:${lead.id}:d` });
  if (lead.status !== "new") actions.push({ text: "В новые", callback_data: `T:${lead.id}:n` });
  return {
    inline_keyboard: [actions, [{ text: "К списку", callback_data: "L:D:0" }]],
  };
}

function shortName(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 24 ? `${clean.slice(0, 23)}…` : clean;
}

export function listView(leads: StoredLead[], mode: SortMode, page: number): { text: string; keyboard: InlineKeyboard } {
  const sorted = sortLeads(leads, mode);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(0, page), pages - 1);
  const slice = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const code = CODE_SORT[mode];
  const lines = slice.length
    ? slice.map((lead) => `№${lead.id} · ${escapeHtml(shortName(lead.name))} · ${STATUS_LABEL[lead.status]} · ${escapeHtml(lead.serviceType || "без услуги")}`)
    : ["Заявок в этом списке нет."];

  const keyboard: InlineKeyboard = {
    inline_keyboard: [
      [
        { text: "Сначала новые", callback_data: "L:D:0" },
        { text: "Сначала старые", callback_data: "L:A:0" },
      ],
      [
        { text: "По статусу", callback_data: "L:S:0" },
        { text: "По услуге", callback_data: "L:U:0" },
      ],
      [{ text: "Не обработанные", callback_data: "L:O:0" }],
      ...slice.map((lead) => [{ text: `№${lead.id} ${shortName(lead.name)} · ${STATUS_LABEL[lead.status]}`, callback_data: `C:${lead.id}` }]),
    ],
  };

  if (pages > 1) {
    const nav: { text: string; callback_data: string }[] = [];
    if (safePage > 0) nav.push({ text: "← Назад", callback_data: `L:${code}:${safePage - 1}` });
    nav.push({ text: `${safePage + 1}/${pages}`, callback_data: `L:${code}:${safePage}` });
    if (safePage < pages - 1) nav.push({ text: "Дальше →", callback_data: `L:${code}:${safePage + 1}` });
    keyboard.inline_keyboard.push(nav);
  }

  return {
    text: `<b>Заявки · ${SORT_LABEL[mode]}</b>\n${lines.join("\n")}`,
    keyboard,
  };
}

function ruLeads(count: number): string {
  const n10 = count % 10;
  const n100 = count % 100;
  if (n10 === 1 && n100 !== 11) return `${count} заявка`;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return `${count} заявки`;
  return `${count} заявок`;
}

function reminderText(leads: StoredLead[], now: number): string {
  const lines = leads.slice(0, 15).map((lead) => {
    const minutes = Math.max(1, Math.round((now - lead.createdAt) / 60_000));
    const age = minutes < 120 ? `${minutes} мин` : `${Math.round(minutes / 60)} ч`;
    return `• №${lead.id} ${escapeHtml(shortName(lead.name))} — ${STATUS_LABEL[lead.status]}, ${age}, ${escapeHtml(lead.phone)}`;
  });
  const extra = leads.length > 15 ? `\nи ещё ${leads.length - 15}` : "";
  return `<b>Напоминание</b>\n${ruLeads(leads.length)} ещё не в статусе «Обработана»:\n${lines.join("\n")}${extra}`;
}

function reminderKeyboard(leads: StoredLead[]): InlineKeyboard {
  return {
    inline_keyboard: [
      ...leads.slice(0, 5).map((lead) => [{ text: `№${lead.id} ${shortName(lead.name)}`, callback_data: `C:${lead.id}` }]),
      [{ text: "Не обработанные", callback_data: "L:O:0" }],
    ],
  };
}

function canManage(settings: TelegramSettings, userId: number | undefined, chat: { id: number; type: string }): boolean {
  if (!userId) return false;
  if (settings.allowedUserIds.length > 0) return settings.allowedUserIds.includes(String(userId));
  return chat.type !== "private" && Boolean(resolvedChatId) && String(chat.id) === resolvedChatId;
}

function helpText(settings: TelegramSettings, userId: number | undefined): string {
  const access = settings.allowedUserIds.length
    ? "Кнопки и списки доступны только сотрудникам из файла src/config/telegram.ts."
    : "Список сотрудников пуст, поэтому менять заявки можно только в рабочем чате. Добавьте id в TELEGRAM_ALLOWED_USER_IDS, чтобы открыть доступ конкретным людям.";
  return [
    "<b>Заявки ООО «РТК»</b>",
    userId ? `Ваш Telegram id: <code>${userId}</code>` : "",
    "",
    "Статусы: Новая, В работе, Обработана.",
    "Пока заявка не отмечена «Обработана», бот присылает напоминание.",
    "",
    "/leads — список, сначала новые",
    "/open — только не обработанные",
    "/sort — те же заявки, под сообщением кнопки сортировки: по дате, статусу и услуге",
    "",
    access,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

async function sendMessage(token: string, chatId: string | number, text: string, keyboard?: InlineKeyboard): Promise<{ ok: boolean; messageId: number | null }> {
  const result = await callTelegram<{ message_id: number }>(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: keyboard } : {}),
  });
  return { ok: result.ok, messageId: result.result?.message_id ?? null };
}

async function editMessage(token: string, chatId: number, messageId: number, text: string, keyboard: InlineKeyboard): Promise<void> {
  const result = await callTelegram(token, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: keyboard,
  });
  if (!result.ok && result.description && !result.description.includes("message is not modified")) {
    await sendMessage(token, chatId, text, keyboard);
  }
}

async function resolveChat(token: string, chatId: string): Promise<void> {
  if (/^-?\d+$/.test(chatId)) {
    resolvedChatId = chatId;
    return;
  }
  const result = await callTelegram<{ id: number }>(token, "getChat", { chat_id: chatId });
  if (result.ok && result.result?.id) resolvedChatId = String(result.result.id);
}

export async function publishLead(lead: LeadInput): Promise<"ok" | "not_configured" | "telegram" | "unavailable"> {
  const settings = readTelegramSettings();
  if (!tokenLooksValid(settings.token) || !chatLooksValid(settings.chatId)) return "not_configured";

  if (!resolvedChatId) await resolveChat(settings.token, settings.chatId);
  const destination = resolvedChatId || settings.chatId;
  const saved = await leadStore.add(
    {
      name: lead.name,
      phone: lead.phone,
      carInfo: lead.carInfo,
      serviceType: lead.serviceType,
      comment: lead.comment,
      createdAt: Date.now(),
    },
    destination,
  );

  try {
    const sent = await sendMessage(settings.token, destination, cardText(saved), cardKeyboard(saved));
    if (!sent.ok || !sent.messageId) {
      await leadStore.remove(saved.id);
      return "telegram";
    }
    await leadStore.update(saved.id, { messageId: sent.messageId, chatId: destination });
    return "ok";
  } catch (error) {
    await leadStore.remove(saved.id);
    console.error("Telegram lead request failed", error instanceof Error ? error.name : "unknown");
    return "unavailable";
  }
}

async function showList(token: string, chatId: number, messageId: number | null, mode: SortMode, page: number): Promise<void> {
  const view = listView(await leadStore.list(), mode, page);
  if (messageId) await editMessage(token, chatId, messageId, view.text, view.keyboard);
  else await sendMessage(token, chatId, view.text, view.keyboard);
}

async function showCard(token: string, chatId: number, messageId: number | null, lead: StoredLead): Promise<void> {
  if (messageId) await editMessage(token, chatId, messageId, cardText(lead), cardKeyboard(lead));
  else await sendMessage(token, chatId, cardText(lead), cardKeyboard(lead));
  const originalChat = Number(lead.chatId);
  if (lead.messageId && Number.isFinite(originalChat) && (originalChat !== chatId || lead.messageId !== messageId)) {
    await editMessage(token, originalChat, lead.messageId, cardText(lead), cardKeyboard(lead)).catch(() => undefined);
  }
}

async function deny(token: string, callbackId: string | null, chatId: number | null): Promise<void> {
  if (callbackId) {
    await callTelegram(token, "answerCallbackQuery", { callback_query_id: callbackId, text: "Нет доступа к заявкам", show_alert: true });
    return;
  }
  if (chatId) await sendMessage(token, chatId, "Нет доступа к заявкам. Добавьте свой Telegram id в src/config/telegram.ts.");
}

async function handleUpdate(update: TelegramUpdate): Promise<void> {
  const settings = readTelegramSettings();
  if (!tokenLooksValid(settings.token)) return;
  if (!resolvedChatId && settings.chatId) await resolveChat(settings.token, settings.chatId);

  if (update.callback_query) {
    const query = update.callback_query;
    const chat = query.message?.chat;
    if (!chat) {
      await callTelegram(settings.token, "answerCallbackQuery", {
        callback_query_id: query.id,
        text: "Сообщение устарело. Откройте /leads",
        show_alert: true,
      });
      return;
    }
    if (!canManage(settings, query.from.id, chat)) {
      await deny(settings.token, query.id, null);
      return;
    }
    await callTelegram(settings.token, "answerCallbackQuery", { callback_query_id: query.id });
    const data = query.data ?? "";
    const listMatch = data.match(/^L:([DASUO]):(\d+)$/);
    if (listMatch) {
      const mode = SORT_CODE[listMatch[1]] ?? "date_desc";
      await showList(settings.token, chat.id, query.message?.message_id ?? null, mode, Number(listMatch[2]));
      return;
    }
    const cardMatch = data.match(/^C:(\d+)$/);
    if (cardMatch) {
      const lead = (await leadStore.list()).find((item) => item.id === Number(cardMatch[1]));
      if (!lead) {
        await sendMessage(settings.token, chat.id, "Заявка уже удалена.");
        return;
      }
      await showCard(settings.token, chat.id, query.message?.message_id ?? null, lead);
      return;
    }
    const statusMatch = data.match(/^T:(\d+):([npd])$/);
    if (statusMatch) {
      const status = STATUS_CODE[statusMatch[2]];
      const updated = await leadStore.update(Number(statusMatch[1]), { status, statusAt: Date.now() });
      if (!updated) {
        await sendMessage(settings.token, chat.id, "Заявка не найдена.");
        return;
      }
      await showCard(settings.token, chat.id, query.message?.message_id ?? null, updated);
    }
    return;
  }

  const message = update.message;
  const text = message?.text?.trim();
  if (!message || !text) return;
  const command = text.match(/^\/([a-z0-9_]+)(?:@\w+)?(?:\s|$)/i)?.[1]?.toLowerCase();
  if (!command) return;

  if (command === "start" || command === "help") {
    await sendMessage(settings.token, message.chat.id, helpText(settings, message.from?.id));
    return;
  }

  if (!canManage(settings, message.from?.id, message.chat)) {
    await deny(settings.token, null, message.chat.id);
    return;
  }

  if (command === "leads" || command === "sort") {
    await showList(settings.token, message.chat.id, null, "date_desc", 0);
    return;
  }
  if (command === "open") {
    await showList(settings.token, message.chat.id, null, "open", 0);
  }
}

async function remindOnce(): Promise<void> {
  if (reminding) return;
  reminding = true;
  try {
    const settings = readTelegramSettings();
    if (!tokenLooksValid(settings.token) || !chatLooksValid(settings.chatId)) return;
    const now = Date.now();
    const due = leadsDueForReminder(
      await leadStore.list(),
      now,
      settings.reminderAfterMinutes,
      settings.reminderRepeatMinutes,
      settings.reminderMaxDays,
    );
    if (!due.length) return;
    const sent = await sendMessage(settings.token, settings.chatId, reminderText(due, now), reminderKeyboard(due));
    if (sent.ok) await leadStore.markReminded(due.map((lead) => lead.id), now);
  } catch (error) {
    console.error("Telegram reminder failed", error instanceof Error ? error.name : "unknown");
  } finally {
    reminding = false;
  }
}

async function poll(): Promise<void> {
  let offset = 0;
  while (polling) {
    const settings = readTelegramSettings();
    if (!tokenLooksValid(settings.token)) {
      await sleep(15_000);
      continue;
    }
    try {
      if (!resolvedChatId && settings.chatId) await resolveChat(settings.token, settings.chatId);
      const data = await callTelegram<TelegramUpdate[]>(settings.token, "getUpdates", {
        offset,
        timeout: 25,
        allowed_updates: ["message", "callback_query"],
      });
      if (!data.ok || !Array.isArray(data.result)) {
        await sleep(3_000);
        continue;
      }
      for (const update of data.result) {
        offset = update.update_id + 1;
        try {
          await handleUpdate(update);
        } catch (error) {
          console.error("Telegram update failed", error instanceof Error ? error.name : "unknown");
        }
      }
    } catch (error) {
      console.error("Telegram poll failed", error instanceof Error ? error.name : "unknown");
      await sleep(3_000);
    }
  }
}

export function startTelegramBot(): void {
  const globalState = globalThis as typeof globalThis & { __rtkTelegramBot?: boolean };
  if (globalState.__rtkTelegramBot) return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NODE_ENV !== "production" && process.env.TELEGRAM_POLLING !== "1") return;
  globalState.__rtkTelegramBot = true;
  polling = true;

  void (async () => {
    try {
    const settings = readTelegramSettings();
    if (tokenLooksValid(settings.token)) {
      await callTelegram(settings.token, "deleteWebhook", { drop_pending_updates: false });
      await callTelegram(settings.token, "setMyCommands", {
        commands: [
          { command: "leads", description: "Список заявок" },
          { command: "open", description: "Только не обработанные" },
          { command: "sort", description: "Сортировка заявок" },
          { command: "help", description: "Что умеет бот" },
        ],
      });
      if (settings.chatId) await resolveChat(settings.token, settings.chatId);
      console.log("Telegram bot polling started");
    } else {
      console.log("Telegram bot is waiting for a token in src/config/telegram.ts");
    }
    void poll();
    setInterval(() => void remindOnce(), 60_000);
    setTimeout(() => void remindOnce(), 10_000);
    } catch (error) {
      console.error("Telegram bot startup failed", error instanceof Error ? error.message : "unknown");
    }
  })();
}
