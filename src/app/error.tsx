"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-extrabold text-slate-950">Не удалось открыть страницу</h1>
      <p className="mt-3 text-slate-600">Обновите страницу или позвоните в сервис.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 font-semibold text-white"
      >
        Повторить
      </button>
    </div>
  );
}
