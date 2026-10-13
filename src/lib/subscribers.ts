import fs from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "data", "subscribers.json");

function clean(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter((id) => /^-?\d{5,20}$/.test(id)))];
}

async function readIds(): Promise<string[] | null> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as { ids?: unknown };
    if (!parsed || !Array.isArray(parsed.ids)) return [];
    return clean(parsed.ids.filter((id): id is string => typeof id === "string"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    return [];
  }
}

async function writeIds(ids: string[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const temp = `${FILE}.tmp`;
  await fs.writeFile(temp, JSON.stringify({ ids: clean(ids) }));
  await fs.rename(temp, FILE);
}

export async function subscriberIds(seed: string[]): Promise<string[]> {
  const stored = await readIds();
  if (stored === null) return clean(seed);
  return stored;
}

export async function addSubscriber(seed: string[], id: string): Promise<string[]> {
  const next = clean([...(await subscriberIds(seed)), id]);
  await writeIds(next);
  return next;
}

export async function removeSubscriber(seed: string[], id: string): Promise<string[]> {
  const next = (await subscriberIds(seed)).filter((item) => item !== id.trim());
  await writeIds(next);
  return next;
}
