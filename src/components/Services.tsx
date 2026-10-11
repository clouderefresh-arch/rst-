import { Car, CircleDot, Cog, Container, Cpu, Package, Snowflake, Truck, Wrench, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const services: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Wrench,
    title: "Сервисное обслуживание и ремонт",
    text: "Компьютерная диагностика, регламентное ТО, капремонт легкового и грузового транспорта.",
  },
  {
    icon: Cog,
    title: "Ремонт и восстановление узлов и агрегатов",
    text: "ДВС, трансмиссии/КПП, ходовая часть, тормоза и рулевые системы.",
  },
  {
    icon: Cpu,
    title: "Электрооборудование и электроника",
    text: "Диагностика бортовых систем, ремонт блоков, проводки и электроники.",
  },
  {
    icon: Snowflake,
    title: "Системы кондиционирования",
    text: "Диагностика, заправка и ремонт климатических систем.",
  },
  {
    icon: CircleDot,
    title: "Шиномонтаж и балансировка",
    text: "Сезонная замена и хранение колес для легковых и коммерческих авто.",
  },
  {
    icon: Package,
    title: "Оптово-розничные поставки запчастей",
    text: "Оригиналы и аналоги, масла, фильтры, техжидкости с доставкой по МО и РФ.",
  },
];

const fleet = [
  {
    icon: Car,
    title: "Легковые",
    text: "Ремонт автомобилей и поставка расходников для частного и корпоративного парка.",
    className: "bg-gradient-to-br from-red-600 to-red-500",
  },
  {
    icon: Truck,
    title: "Грузовые",
    text: "Обслуживание коммерческого и грузового автотранспорта.",
    className: "bg-gradient-to-br from-orange-600 to-orange-500",
  },
  {
    icon: Container,
    title: "Спецтехника",
    text: "Сервис специальной техники и сопровождение юридических лиц.",
    className: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-28 bg-white pb-20 pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Сервис"
          title="Предоставляемые услуги"
          text="Ремонт, обслуживание и снабжение автотранспорта в Подольске, Климовске и с доставкой по России."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-card ring-1 ring-white/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_2px_rgba(249,115,22,0.85)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 transition duration-300 group-hover:scale-x-100" />
                <span className="absolute right-5 top-4 text-4xl font-black text-white/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-950/40 transition group-hover:scale-105">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="text-xl font-bold leading-snug">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{service.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-14">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Обслуживаемый транспорт</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {fleet.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className={`relative overflow-hidden rounded-3xl p-6 text-white ${item.className}`}>
                  <Icon className="absolute -right-2 -bottom-3 h-24 w-24 text-white/15" aria-hidden />
                  <h4 className="text-xl font-extrabold">{item.title}</h4>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/90">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
