import { SectionHeading } from "@/components/SectionHeading";

const facts = [
  { value: "2 города", label: "Подольск и Климовск" },
  { value: "Опт и розница", label: "Запчасти и расходные материалы" },
  { value: "Ежедневно", label: "Приём по записи" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-28 bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div>
          <SectionHeading eyebrow="Компания" title="О компании" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            <p>
              ООО «РТК» — торговая компания. Делаем сервисное обслуживание и ремонт легковых и грузовых
              автомобилей, спецтехники, а также поставляем запчасти и расходные материалы оптом и в розницу.
            </p>
            <p>
              Работаем в Подольске и Климовске. Доставляем запчасти по Московской области и в любой регион
              России. Частным клиентам и организациям доступна запись на ремонт через форму на сайте.
            </p>
          </div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {facts.map((fact) => (
            <div key={fact.value} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-slate-200">
              <dt className="text-xl font-extrabold text-slate-950">{fact.value}</dt>
              <dd className="mt-1 text-sm text-slate-600">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
