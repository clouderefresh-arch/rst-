import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-950">Страница не найдена</h1>
      <p className="mt-3 text-slate-600">Этот адрес не относится к сайту ООО «РТК».</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 font-semibold text-white"
      >
        На главную
      </Link>
    </div>
  );
}
