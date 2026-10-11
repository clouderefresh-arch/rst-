import { NextResponse } from "next/server";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "@/config/telegram";
import {
  formatLeadMessage,
  leadErrorMessage,
  leadStatus,
  normalizeLead,
  validateLead,
  type LeadErrorCode,
} from "@/lib/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function fail(code: LeadErrorCode) {
  return NextResponse.json(
    { ok: false, error: leadErrorMessage(code) },
    { status: leadStatus(code) },
  );
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(length) && length > 20_000) {
    return fail("payload_too_large");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("invalid_json");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return fail("invalid_json");
  }

  const lead = normalizeLead(payload as Partial<Record<string, unknown>>);

  if (lead.company) {
    return NextResponse.json({ ok: true });
  }

  const invalid = validateLead(lead);
  if (invalid) return fail(invalid);

  if (isRateLimited(clientIp(request))) return fail("rate_limited");

  const token = (process.env.TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN).trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID).trim();
  const tokenOk = /^\d+:[A-Za-z0-9_-]+$/.test(token);
  const chatOk = /^(@[A-Za-z0-9_]{5,}|-?\d+)$/.test(chatId);
  if (!tokenOk || !chatOk) return fail("not_configured");

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatLeadMessage(lead, new Date()),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    const data = (await telegram.json().catch(() => null)) as { ok?: boolean } | null;
    if (!telegram.ok || !data?.ok) {
      console.error("Telegram lead delivery failed", telegram.status);
      return fail("telegram");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram lead request failed", error instanceof Error ? error.name : "unknown");
    return fail("unavailable");
  }
}
