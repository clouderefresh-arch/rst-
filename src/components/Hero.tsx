import { LeadForm } from "@/components/LeadForm";

function HeroStripes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 780"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="rtk-red" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="62%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="rtk-orange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <polygon points="900,-80 1180,-80 860,860 540,860" fill="url(#rtk-red)" />
        <polygon points="1120,-90 1420,-90 1160,880 840,880" fill="url(#rtk-orange)" />
        <polygon points="1320,-40 1620,20 1360,900 1100,820" fill="#dc2626" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink/25 lg:bg-gradient-to-r lg:from-ink lg:via-ink/72 lg:to-transparent" />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pb-28 text-white sm:pb-32">
      <HeroStripes />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pt-14">
        <div>
          <p className="inline-flex max-w-full items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-950/40 sm:text-sm">
            г. Подольск • г. Климовск • Доставка по всей РФ
          </p>
          <h1 className="mt-5 max-w-xl text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Сервисные решения для вашего автотранспорта
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Комплексный ремонт легковых и грузовых автомобилей, спецтехники. Поставки запчастей и
            расходных материалов оптом и в розницу.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lead"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500"
            >
              Оставить заявку
            </a>
            <a
              href="#parts"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-center text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:brightness-110"
            >
              Опт и запчасти по всей РФ
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
          <div className="absolute bottom-3 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-full bg-black/50 blur-xl" aria-hidden />
          {/* Cutout sits on the diagonal plates; next/image would flatten the shadow. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-car.png"
            alt="Белый кроссовер — легковой автотранспорт на обслуживании РТК"
            width={640}
            height={382}
            fetchPriority="high"
            className="relative mx-auto h-auto w-full drop-shadow-[0_28px_36px_rgba(0,0,0,0.45)] motion-safe:animate-float"
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto -mb-40 mt-8 max-w-5xl px-4 sm:-mb-44 sm:px-6 lg:px-8">
        <LeadForm />
      </div>
    </section>
  );
}
