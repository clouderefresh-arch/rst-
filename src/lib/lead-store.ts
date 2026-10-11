import fs from "fs/promises";
import path from "path";

export type LeadStatus = "new" | "progress" | "done";

export type SortMode = "date_desc" | "date_asc" | "status" | "service" | "open";

export type StoredLead = {
  id: number;
  name: string;
  phone: string;
  carInfo: string;
  serviceType: string;
  comment: string;
  createdAt: number;
  status: LeadStatus;
  statusAt: number;
  lastReminderAt: number | null;
  chatId: string;
  messageId: number | null;
};

export type NewLead = Omit<StoredLead, "id" | "status" | "statusAt" | "lastReminderAt" | "chatId" | "messageId">;

type StoreData = {
  seq: number;
  leads: StoredLead[];
};

const STATUS_RANK: Record<LeadStatus, number> = {
  new: 0,
  progress: 1,
  done: 2,
};

const MAX_LEADS = 500;

function emptyStore(): StoreData {
  return { seq: 0, leads: [] };
}

async function readStore(filePath: string): Promise<StoreData> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    if (!parsed || !Array.isArray(parsed.leads) || typeof parsed.seq !== "number") return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeStore(filePath: string, data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.tmp`;
  await fs.writeFile(temp, JSON.stringify(data), "utf8");
  await fs.rename(temp, filePath);
}

export function sortLeads(leads: StoredLead[], mode: SortMode): StoredLead[] {
  const copy = leads.filter((lead) => mode !== "open" || lead.status !== "done");
  copy.sort((a, b) => {
    if (mode === "date_asc") return a.createdAt - b.createdAt || a.id - b.id;
    if (mode === "status" || mode === "open") {
      const byStatus = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      if (byStatus !== 0) return byStatus;
      return b.createdAt - a.createdAt || b.id - a.id;
    }
    if (mode === "service") {
      const byService = (a.serviceType || "яяя").localeCompare(b.serviceType || "яяя", "ru");
      if (byService !== 0) return byService;
      return b.createdAt - a.createdAt || b.id - a.id;
    }
    return b.createdAt - a.createdAt || b.id - a.id;
  });
  return copy;
}

export function leadsDueForReminder(
  leads: StoredLead[],
  now: number,
  afterMinutes: number,
  repeatMinutes: number,
  maxDays: number,
): StoredLead[] {
  const afterMs = Math.max(0, afterMinutes) * 60_000;
  const repeatMs = Math.max(1, repeatMinutes) * 60_000;
  const maxMs = maxDays > 0 ? maxDays * 24 * 60 * 60_000 : Number.POSITIVE_INFINITY;

  return leads
    .filter((lead) => {
      if (lead.status === "done") return false;
      const age = now - lead.createdAt;
      if (age < afterMs || age > maxMs) return false;
      if (lead.lastReminderAt != null && now - lead.lastReminderAt < repeatMs) return false;
      return true;
    })
    .sort((a, b) => a.createdAt - b.createdAt);
}

function trim(data: StoreData): void {
  if (data.leads.length <= MAX_LEADS) return;
  const done = data.leads.filter((lead) => lead.status === "done").sort((a, b) => a.createdAt - b.createdAt);
  while (data.leads.length > MAX_LEADS && done.length) {
    const oldest = done.shift();
    data.leads = data.leads.filter((lead) => lead.id !== oldest?.id);
  }
  data.leads.sort((a, b) => a.createdAt - b.createdAt);
  while (data.leads.length > MAX_LEADS) data.leads.shift();
}

export function createLeadStore(filePath: string) {
  let chain: Promise<void> = Promise.resolve();

  function exclusive<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
    const run = chain.then(async () => {
      const data = await readStore(filePath);
      const result = await fn(data);
      await writeStore(filePath, data);
      return result;
    });
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  return {
    add(input: NewLead, chatId: string): Promise<StoredLead> {
      return exclusive((data) => {
        data.seq += 1;
        const now = input.createdAt;
        const lead: StoredLead = {
          ...input,
          id: data.seq,
          status: "new",
          statusAt: now,
          lastReminderAt: null,
          chatId,
          messageId: null,
        };
        data.leads.push(lead);
        trim(data);
        return { ...lead };
      });
    },
    update(id: number, patch: Partial<Pick<StoredLead, "status" | "statusAt" | "lastReminderAt" | "messageId" | "chatId">>): Promise<StoredLead | null> {
      return exclusive((data) => {
        const lead = data.leads.find((item) => item.id === id);
        if (!lead) return null;
        Object.assign(lead, patch);
        return { ...lead };
      });
    },
    remove(id: number): Promise<void> {
      return exclusive((data) => {
        data.leads = data.leads.filter((lead) => lead.id !== id);
      });
    },
    list(): Promise<StoredLead[]> {
      return exclusive((data) => data.leads.map((lead) => ({ ...lead })));
    },
    markReminded(ids: number[], now: number): Promise<void> {
      return exclusive((data) => {
        for (const lead of data.leads) {
          if (ids.includes(lead.id)) lead.lastReminderAt = now;
        }
      });
    },
  };
}

export const leadStore = createLeadStore(path.join(process.cwd(), "data", "leads.json"));
