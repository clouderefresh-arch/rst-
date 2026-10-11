import { BadgeCheck, FileCheck2, Phone, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

const points = [
  {
    icon: FileCheck2,
    title: "Договор с НДС",
    text: "Работаем с юридическими лицами по договору, с закрывающими документами.",
  },
  {
    icon: UserRound,
    title: "Персональный менеджер",
    text: "Один контакт на сервис, запчасти и согласование заявок автопарка.",
  },
  {
    icon: BadgeCheck,
    title: "Парк легковых и грузовых",
    text: "Регламентное обслуживание, ремонт узлов и снабжение расходными материалами.",
  },
];

export function Fleet() {
  return (
    <section id="fleet" className="scroll-mt-28 bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow=""
            title="Автопаркам"
            text="Корпоративное обслуживание транспорта: сервис, запчасти и персональное сопровождение."
          />
          <ul className="mt-8 space-y-4">
            {points.map((point) => {
              const Icon = point.icon;
              return (
                <li key={point.title} className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-bold text-slate-950">{point.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{point.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="rounded-[28px] bg-ink p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Корпоративный сервис</p>
          <h3 className="mt-3 text-3xl font-extrabold leading-tight">Обслуживание автопарка по договору</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Оставьте заявку с пометкой «Корпоративное обслуживание» — менеджер свяжется и уточнит состав парка.
          </p>
          <a
            href="#lead"
            className="mt-6 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-semibold text-white"
          >
            Оставить заявку для юрлица
          </a>
          <a href={PHONE_HREF} className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Phone className="h-4 w-4 text-orange-400" aria-hidden />
            {PHONE_DISPLAY}
          </a>
        </aside>
      </div>
    </section>
  );
}
