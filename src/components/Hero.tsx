import { HeroCar } from "@/components/HeroCar";
import { LeadForm } from "@/components/LeadForm";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pb-28 text-white sm:pb-32">
      <HeroCar />
      <div className="relative mx-auto min-h-[34rem] max-w-7xl px-4 pb-4 pt-12 sm:min-h-[36rem] sm:px-6 lg:min-h-[40rem] lg:px-8 lg:pt-24">
        <div className="max-w-xl">
          <p className="inline-flex max-w-full items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-950/40 sm:text-sm">
            г. Подольск • г. Климовск • Доставка по всей РФ
          </p>
          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Сервисные решения для вашего автотранспорта
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
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
      </div>

      <div className="relative z-20 mx-auto -mb-40 mt-2 max-w-5xl px-4 sm:-mb-44 sm:px-6 lg:-mt-10 lg:px-8">
        <LeadForm />
      </div>
    </section>
  );
}
