"use client";

import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { PARTS_SERVICE, SERVICE_OPTIONS } from "@/lib/lead";

type Status = "idle" | "loading" | "success" | "error";
type LeadFormProps = { purpose?: "service" | "parts" };

const fieldClass =
  "h-10 w-full rounded-lg border-0 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none ring-1 ring-black/5 placeholder:text-slate-400 focus:ring-2 focus:ring-white";

export function LeadForm({ purpose = "service" }: LeadFormProps) {
  const isParts = purpose === "parts";
  const fieldId = isParts ? "parts" : "lead";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const partNumber = String(data.get("partNumber") || "").trim();
    const vin = String(data.get("vin") || "").trim();
    const carInfo = isParts
      ? [partNumber && `Партномер ${partNumber}`, vin && `VIN ${vin}`].filter(Boolean).join(" / ")
      : String(data.get("carInfo") || "").trim();

    if (!name || !phone) {
      setStatus("error");
      setError("Укажите имя и телефон");
      return;
    }

    if (isParts && !partNumber && !vin) {
      setStatus("error");
      setError("Укажите партномер детали или VIN автомобиля");
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
          carInfo,
          serviceType: isParts ? PARTS_SERVICE : String(data.get("serviceType") || "").trim(),
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
      id={isParts ? "parts-lead" : "lead"}
      onSubmit={onSubmit}
      aria-busy={status === "loading"}
      className="scroll-mt-28 rounded-3xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-4 shadow-card"
    >
      <div className="mb-3 text-center">
        <h2 className="text-lg font-extrabold leading-tight text-white">
          {isParts ? "Подбор запчастей" : "Форма записи на ремонт"}
        </h2>
        <p className="mt-1 text-xs leading-snug text-white/85">
          {isParts
            ? "Укажите партномер детали или VIN автомобиля"
            : "Дежурный мастер перезвонит и подтвердит визит"}
        </p>
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor={`${fieldId}-hp`}>Не заполняйте</label>
        <input id={`${fieldId}-hp`} name="rtk_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div>
          <label htmlFor={`${fieldId}-name`} className="sr-only">
            Имя
          </label>
          <input id={`${fieldId}-name`} name="name" type="text" required autoComplete="name" placeholder="Имя" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={`${fieldId}-phone`} className="sr-only">
            Телефон
          </label>
          <input
            id={`${fieldId}-phone`}
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="Телефон"
            className={fieldClass}
          />
        </div>
        {isParts ? (
          <>
            <div>
              <label htmlFor={`${fieldId}-part`} className="sr-only">
                Партномер детали
              </label>
              <input
                id={`${fieldId}-part`}
                name="partNumber"
                type="text"
                autoComplete="off"
                placeholder="Партномер детали"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor={`${fieldId}-vin`} className="sr-only">
                VIN автомобиля
              </label>
              <input
                id={`${fieldId}-vin`}
                name="vin"
                type="text"
                autoComplete="off"
                placeholder="VIN автомобиля"
                className={fieldClass}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor={`${fieldId}-car`} className="sr-only">
              Марка автомобиля или VIN
            </label>
            <input
              id={`${fieldId}-car`}
              name="carInfo"
              type="text"
              autoComplete="off"
              placeholder="Марка авто / VIN"
              className={fieldClass}
            />
          </div>
        )}
      </div>

      {isParts ? null : (
        <div className="relative mt-2">
          <label htmlFor={`${fieldId}-service`} className="sr-only">
            Тип услуги
          </label>
          <select id={`${fieldId}-service`} name="serviceType" defaultValue="" className={`${fieldClass} appearance-none pr-10`}>
            <option value="">Тип услуги</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
        </div>
      )}

      <div className="mt-2">
        <label htmlFor={`${fieldId}-comment`} className="sr-only">
          {isParts ? "Комментарий к подбору" : "Краткое описание проблемы"}
        </label>
        <textarea
          id={`${fieldId}-comment`}
          name="comment"
          rows={2}
          placeholder={isParts ? "Комментарий: количество, марка, срок" : "Краткое описание проблемы"}
          className="w-full resize-y rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-1 ring-black/5 placeholder:text-slate-400 focus:ring-2 focus:ring-white"
        />
      </div>

      <label className="mt-3 flex items-start gap-2.5 text-xs leading-snug text-white">
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-400 px-3 py-2 text-center text-sm font-bold leading-tight text-white shadow-lg shadow-black/15 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Отправляем…
          </>
        ) : isParts ? (
          "Подобрать запчасти"
        ) : (
          "Записаться на ремонт автотранспорта"
        )}
      </button>

      {status === "success" ? (
        <p
          role="status"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {isParts ? "Заявка отправлена, менеджер подберёт запчасти и перезвонит" : "Заявка отправлена, мастер перезвонит вам"}
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
