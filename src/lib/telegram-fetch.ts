import dns from "node:dns/promises";
import https from "node:https";

const HOST = "api.telegram.org";

// The provider drops the usual DNS address 149.154.166.110.
// 149.154.167.220 answers and serves the same API certificate.
const FALLBACK_IPS = ["149.154.167.220"];

let workingIp: string | null = FALLBACK_IPS[0] ?? null;

function unique(values: Array<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

async function candidateIps(): Promise<string[]> {
  let resolved: string[] = [];
  try {
    resolved = await dns.resolve4(HOST);
  } catch {
    resolved = [];
  }
  return unique([workingIp, ...FALLBACK_IPS, ...resolved]);
}

function postJson(
  ip: string,
  path: string,
  payload: string,
  timeoutMs: number,
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: HOST,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        lookup: (hostname, options, callback) => {
          const done = typeof options === "function" ? options : callback;
          const all = typeof options === "function" ? false : Boolean(options.all);
          if (all) done(null, [{ address: ip, family: 4 }]);
          else done(null, ip, 4);
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          try {
            resolve(JSON.parse(text) as { ok: boolean; result?: unknown; description?: string });
          } catch {
            resolve({ ok: false });
          }
        });
      },
    );

    request.setTimeout(timeoutMs, () => request.destroy(new Error("timeout")));
    request.on("error", (error) => reject(error));
    request.end(payload);
  });
}

export async function telegramRequest<T>(
  token: string,
  method: string,
  body: Record<string, unknown>,
  timeoutMs: number,
): Promise<{ ok: boolean; result?: T; description?: string }> {
  const payload = JSON.stringify(body);
  const ips = await candidateIps();
  let lastError: Error | null = null;

  for (const ip of ips) {
    try {
      const result = await postJson(ip, `/bot${token}/${method}`, payload, timeoutMs);
      workingIp = ip;
      return result as { ok: boolean; result?: T; description?: string };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("telegram-unreachable");
    }
  }

  throw lastError ?? new Error("telegram-unreachable");
}
