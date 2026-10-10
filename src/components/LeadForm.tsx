"use client";

import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { SERVICE_OPTIONS } from "@/lib/lead";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-xl border-0 bg-white px-4 text-base text-slate-900 shadow-sm outline-none ring-1 ring-black/5 placeholder:text-slate-400 focus:ring-2 focus:ring-white";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    if (!name || !phone) {
      setStatus("error");
      setError("Укажите имя и телефон");
      return;
    }

    if (data.get("consent") !== "on") {
      setStatus("error");
      setError("Нужно согласие на обработку данных");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          carInfo: String(data.get("carInfo") || "").trim(),
          serviceType: String(data.get("serviceType") || "").trim(),
          comment: String(data.get("comment") || "").trim(),
          consent: true,
          company: String(data.get("rtk_hp") || ""),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setError(payload?.error || "Не удалось отправить заявку. Позвоните нам.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Нет соединения. Проверьте интернет или позвоните нам.");
    }
  }

  return (
    <form
      id="lead"
      onSubmit={onSubmit}
      aria-busy={status === "loading"}
      className="scroll-mt-28 rounded-[28px] bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-4 shadow-card sm:p-6 lg:p-8"
    >
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Форма записи на ремонт</h2>
        <p className="mt-1 text-sm text-white/85">Дежурный мастер перезвонит и подтвердит визит</p>
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="lead-hp">Не заполняйте</label>
        <input id="lead-hp" name="rtk_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="lead-name" className="sr-only">
            Имя
          </label>
          <input id="lead-name" name="name" type="text" required autoComplete="name" placeholder="Имя" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="lead-phone" className="sr-only">
            Телефон
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="Телефон"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="lead-car" className="sr-only">
            Марка автомобиля или VIN
          </label>
          <input
            id="lead-car"
            name="carInfo"
            type="text"
            autoComplete="off"
            placeholder="Марка авто / VIN"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="relative mt-3">
        <label htmlFor="lead-service" className="sr-only">
          Тип услуги
        </label>
        <select id="lead-service" name="serviceType" defaultValue="" className={`${fieldClass} appearance-none pr-10`}>
          <option value="">Тип услуги</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
      </div>

      <div className="mt-3">
        <label htmlFor="lead-comment" className="sr-only">
          Краткое описание проблемы
        </label>
        <textarea
          id="lead-comment"
          name="comment"
          rows={4}
          placeholder="Краткое описание проблемы"
          className="w-full resize-y rounded-xl border-0 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-1 ring-black/5 placeholder:text-slate-400 focus:ring-2 focus:ring-white"
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm leading-snug text-white">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-white bg-white accent-red-600"
        />
        <span>
          Согласен на обработку персональных данных для связи по заявке.{" "}
          <a href="#privacy" className="underline decoration-white/50 underline-offset-2">
            Подробнее
          </a>
        </span>
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1.5fr_0.9fr]">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-400 px-4 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:text-base"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Отправляем…
            </>
          ) : (
            "Записаться на ремонт автотранспорта"
          )}
        </button>
        <a
          href="#parts"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-slate-900 sm:text-base"
        >
          Каталог запчастей
        </a>
      </div>

      {status === "success" ? (
        <p
          role="status"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Заявка отправлена, мастер перезвонит вам
        </p>
      ) : null}

      {status === "error" ? (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </form>
  );
}
