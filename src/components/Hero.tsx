import { Phone } from "lucide-react";
import { HeroCar } from "@/components/HeroCar";
import { LeadForm } from "@/components/LeadForm";
import { PHONE_HREF } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pb-12 text-white sm:pb-16">
      <HeroCar />
      <div className="relative z-20 mx-auto grid max-w-7xl items-start gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-8 lg:px-8 lg:pt-16 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
        <div className="max-w-xl">
          <p className="inline-flex max-w-full items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-red-950/40 sm:text-sm">
            г. Подольск • г. Климовск • Доставка по всей РФ
          </p>
          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[2.7rem] xl:text-5xl">
            Сервисные решения для вашего автотранспорта
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base">
            Комплексный ремонт и сервисное обслуживание грузовых, легковых автомобилей и спецтехники.
            Подбор запчастей, ремонт и обслуживание с использованием комплектующих, имеющихся на
            собственном складе. Поставки запчастей и расходных материалов оптом и в розницу для
            европейских и азиатских марок.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lead"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500"
            >
              Оставить заявку
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-center text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:brightness-110"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Связаться
            </a>
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
