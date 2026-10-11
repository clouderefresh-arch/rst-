import { NextResponse } from "next/server";
import {
  leadErrorMessage,
  leadStatus,
  normalizeLead,
  validateLead,
  type LeadErrorCode,
} from "@/lib/lead";
import { publishLead } from "@/lib/telegram-bot";

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

  const delivered = await publishLead(lead);
  if (delivered !== "ok") return fail(delivered);
  return NextResponse.json({ ok: true });
}
