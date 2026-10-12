import { Building2, ShieldCheck, Truck, Warehouse, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const banners: {
  icon: LucideIcon;
  title: string;
  text: string;
  className: string;
  plate: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Официальная гарантия и прозрачные цены",
    text: "Состав работ и стоимость понятны до начала ремонта. На выполненные работы действует гарантия.",
    className: "bg-gradient-to-br from-red-600 via-red-600 to-orange-600",
    plate: "bg-white/10",
  },
  {
    icon: Building2,
    title: "Программы для автопарков и юридических лиц",
    text: "Работа по договору с НДС, персональный менеджер.",
    className: "bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500",
    plate: "bg-white/15",
  },
  {
    icon: Warehouse,
    title: "Собственный склад деталей и экспресс-подбор запчастей по VIN",
    text: "Оригиналы и аналоги европейских и азиатских марок подбираем по партномеру и VIN со своего склада.",
    className: "bg-slate-900",
    plate: "bg-gradient-to-bl from-red-600 to-orange-500",
  },
  {
    icon: Truck,
    title: "Оперативная доставка по Подольску, Климовску и в любой регион России",
    text: "Отгрузка со склада по городу и отправка в регионы транспортными компаниями.",
    className: "bg-ink",
    plate: "bg-gradient-to-bl from-orange-500 to-amber-400",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="scroll-mt-28 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Почему РТК"
          title="Наши преимущества"
          text="В первую очередь работаем с автопарками и компаниями. Частный легковой транспорт принимаем по записи."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {banners.map((banner) => {
            const Icon = banner.icon;
            return (
              <article
                key={banner.title}
                className={`relative min-h-[250px] overflow-hidden rounded-[28px] p-6 text-white shadow-card sm:p-8 ${banner.className}`}
              >
                <div
                  className={`pointer-events-none absolute inset-y-0 right-0 w-[42%] ${banner.plate}`}
                  style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }}
                  aria-hidden
                />
                <div className="pointer-events-none absolute -right-6 bottom-[-18px] h-36 w-36 rotate-12 rounded-[32px] border-[12px] border-white/15" aria-hidden />
                <Icon className="absolute right-8 top-8 h-16 w-16 text-white/25" aria-hidden />
                <div className="relative max-w-md">
                  <h3 className="text-2xl font-extrabold leading-tight">{banner.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">{banner.text}</p>
                  <a
                    href={banner.icon === Warehouse ? "#parts-lead" : "#lead"}
                    className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-50"
                  >
                    {banner.icon === Warehouse ? "Подобрать запчасти" : "Записаться"}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
