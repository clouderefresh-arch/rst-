export const SERVICE_OPTIONS = [
  "Сервисное обслуживание и ТО",
  "Ремонт узлов и агрегатов (ДВС/КПП)",
  "Электрооборудование и электроника",
  "Кондиционирование",
  "Шиномонтаж и балансировка",
  "Поставка запчастей (опт/розница)",
  "Корпоративное обслуживание",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export type LeadInput = {
  name: string;
  phone: string;
  carInfo: string;
  serviceType: string;
  comment: string;
  consent: boolean;
  company: string;
};

export type LeadErrorCode =
  | "invalid_json"
  | "payload_too_large"
  | "required"
  | "name"
  | "phone"
  | "service"
  | "consent"
  | "rate_limited"
  | "not_configured"
  | "telegram"
  | "unavailable";

const NAME_RE = /^(?=.*\p{L})[\p{L}\s.'-]{2,80}$/u;
const PHONE_RE = /^[+\d\s().-]{10,20}$/;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanLine(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanMultiline(value: string, max: number): string {
  return value
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function isServiceOption(value: string): value is ServiceOption {
  return (SERVICE_OPTIONS as readonly string[]).includes(value);
}

export function normalizeLead(raw: Partial<Record<keyof LeadInput, unknown>>): LeadInput {
  return {
    name: cleanLine(typeof raw.name === "string" ? raw.name : "", 80),
    phone: cleanLine(typeof raw.phone === "string" ? raw.phone : "", 20),
    carInfo: cleanLine(typeof raw.carInfo === "string" ? raw.carInfo : "", 120),
    serviceType: cleanLine(typeof raw.serviceType === "string" ? raw.serviceType : "", 120),
    comment: cleanMultiline(typeof raw.comment === "string" ? raw.comment : "", 1000),
    consent: raw.consent === true,
    company: cleanLine(typeof raw.company === "string" ? raw.company : "", 120),
  };
}

export function validateLead(lead: LeadInput): LeadErrorCode | null {
  const nameOk = NAME_RE.test(lead.name);
  const digits = lead.phone.replace(/\D/g, "");
  const phoneOk = PHONE_RE.test(lead.phone) && digits.length >= 10 && digits.length <= 15;
  if (!lead.name && !lead.phone) return "required";
  if (!nameOk) return "name";
  if (!phoneOk) return "phone";
  if (lead.serviceType && !isServiceOption(lead.serviceType)) return "service";
  if (!lead.consent) return "consent";
  return null;
}

export function leadErrorMessage(code: LeadErrorCode): string {
  switch (code) {
    case "invalid_json":
      return "Некорректный формат запроса";
    case "payload_too_large":
      return "Слишком большой запрос";
    case "required":
      return "Укажите имя и телефон";
    case "name":
      return "Укажите имя";
    case "phone":
      return "Проверьте номер телефона";
    case "service":
      return "Выберите услугу из списка";
    case "consent":
      return "Нужно согласие на обработку данных";
    case "rate_limited":
      return "Слишком много заявок. Позвоните нам: +7 (925) 303-12-13";
    case "not_configured":
      return "Сервис заявок временно недоступен. Позвоните нам: +7 (925) 303-12-13";
    case "telegram":
      return "Не удалось отправить заявку. Позвоните нам: +7 (925) 303-12-13";
    default:
      return "Сервер временно недоступен. Позвоните нам: +7 (925) 303-12-13";
  }
}

export function leadStatus(code: LeadErrorCode): number {
  switch (code) {
    case "invalid_json":
    case "required":
    case "name":
    case "phone":
    case "service":
    case "consent":
      return 400;
    case "payload_too_large":
      return 413;
    case "rate_limited":
      return 429;
    case "telegram":
      return 502;
    default:
      return 500;
  }
}

export function formatLeadMessage(lead: LeadInput, sentAt: Date): string {
  const when = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(sentAt);

  const rows = [
    "<b>Новая заявка — ООО «РТК»</b>",
    `Дата: ${escapeHtml(when)} (МСК)`,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Авто / VIN:</b> ${escapeHtml(lead.carInfo || "—")}`,
    `<b>Услуга:</b> ${escapeHtml(lead.serviceType || "—")}`,
    `<b>Комментарий:</b> ${escapeHtml(lead.comment || "—")}`,
  ];

  return rows.join("\n");
}
