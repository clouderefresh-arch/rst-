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

function postBody(
  ip: string,
  path: string,
  payload: string | Buffer,
  contentType: string,
  timeoutMs: number,
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: HOST,
        path,
        method: "POST",
        headers: {
          "Content-Type": contentType,
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

async function postToTelegram(
  token: string,
  method: string,
  payload: string | Buffer,
  contentType: string,
  timeoutMs: number,
): Promise<{ ok: boolean; result?: unknown; description?: string }> {
  const ips = await candidateIps();
  let lastError: Error | null = null;

  for (const ip of ips) {
    try {
      const result = await postBody(ip, `/bot${token}/${method}`, payload, contentType, timeoutMs);
      workingIp = ip;
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("telegram-unreachable");
    }
  }

  throw lastError ?? new Error("telegram-unreachable");
}

export async function telegramRequest<T>(
  token: string,
  method: string,
  body: Record<string, unknown>,
  timeoutMs: number,
): Promise<{ ok: boolean; result?: T; description?: string }> {
  const result = await postToTelegram(token, method, JSON.stringify(body), "application/json", timeoutMs);
  return result as { ok: boolean; result?: T; description?: string };
}

export async function telegramSendDocument(
  token: string,
  chatId: string | number,
  filename: string,
  file: Buffer,
  caption: string,
): Promise<{ ok: boolean; description?: string }> {
  const boundary = `----rtk${Date.now().toString(16)}`;
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n` +
        `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n` +
        `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${filename}"\r\n` +
        `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`,
    ),
    file,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  return postToTelegram(token, "sendDocument", body, `multipart/form-data; boundary=${boundary}`, 20_000);
}
