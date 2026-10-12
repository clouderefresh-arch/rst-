import fs from "fs";
import path from "path";

export type TelegramSettings = {
  token: string;
  chatId: string;
  allowedUserIds: string[];
  notifyUserIds: string[];
  reminderAfterMinutes: number;
  reminderRepeatMinutes: number;
  reminderMaxDays: number;
};

const FILE = path.join(process.cwd(), "src/config/telegram.ts");

function readSource(): string {
  try {
    return fs.readFileSync(FILE, "utf8");
  } catch {
    return "";
  }
}

function stringConst(source: string, name: string): string {
  const match = source.match(new RegExp(`export const ${name}\\s*=\\s*"([^"]*)"`));
  return match?.[1] ?? "";
}

function numberConst(source: string, name: string, fallback: number): number {
  const match = source.match(new RegExp(`export const ${name}\\s*=\\s*(\\d+)`));
  if (!match) return fallback;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : fallback;
}

function stringArray(source: string, name: string): string[] {
  const match = source.match(new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]*)"/g)].map((item) => item[1]);
}

function numericIds(values: string[]): string[] {
  return values.map((item) => item.trim()).filter((item) => /^-?\d+$/.test(item));
}

export function readTelegramSettings(): TelegramSettings {
  const source = readSource();
  const envAllowed = (process.env.TELEGRAM_ALLOWED_USER_IDS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    token: (process.env.TELEGRAM_BOT_TOKEN || stringConst(source, "TELEGRAM_BOT_TOKEN")).trim(),
    chatId: (process.env.TELEGRAM_CHAT_ID || stringConst(source, "TELEGRAM_CHAT_ID")).trim(),
    allowedUserIds: envAllowed.length ? numericIds(envAllowed) : numericIds(stringArray(source, "TELEGRAM_ALLOWED_USER_IDS")),
    notifyUserIds: numericIds(
      (process.env.TELEGRAM_NOTIFY_USER_IDS ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .concat(stringArray(source, "TELEGRAM_NOTIFY_USER_IDS")),
    ),
    reminderAfterMinutes: numberConst(source, "TELEGRAM_REMINDER_AFTER_MINUTES", 30),
    reminderRepeatMinutes: numberConst(source, "TELEGRAM_REMINDER_REPEAT_MINUTES", 60),
    reminderMaxDays: numberConst(source, "TELEGRAM_REMINDER_MAX_DAYS", 7),
  };
}

export function tokenLooksValid(token: string): boolean {
  return /^\d+:[A-Za-z0-9_-]+$/.test(token);
}

export function chatLooksValid(chatId: string): boolean {
  return /^(@[A-Za-z0-9_]{5,}|-?\d+)$/.test(chatId);
}
