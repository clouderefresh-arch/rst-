import { Cog, Cpu, Disc, Droplets, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const categories: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Cog,
    title: "Двигатель и КПП",
    text: "Узлы, прокладки, расходники и комплектующие для ДВС и трансмиссии.",
  },
  {
    icon: Disc,
    title: "Тормоза и ходовая",
    text: "Диски, колодки, элементы подвески и рулевого управления.",
  },
  {
    icon: Droplets,
    title: "Масла и фильтры",
    text: "Моторные масла, технические жидкости и фильтры оптом и в розницу.",
  },
  {
    icon: Cpu,
    title: "Электрика и климат",
    text: "Датчики, блоки управления и элементы систем кондиционирования.",
  },
];

export function Parts() {
  return (
    <section id="parts" className="relative scroll-mt-28 overflow-hidden bg-ink py-20 text-white">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-80 w-72 rotate-12 bg-gradient-to-b from-red-600 via-orange-500 to-amber-500 opacity-90"
        style={{ clipPath: "polygon(30% 0, 100% 0, 78% 100%, 0 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Снабжение"
          title="Запчасти оптом и в розницу"
          text="Оригиналы и аналоги, масла, фильтры и техжидкости. Подбор по VIN, собственный склад, доставка по Московской области и всей России."
          light
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.text}</p>
              </article>
            );
          })}
        </div>
        <a
          href="#lead"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-6 text-sm font-semibold text-white"
        >
          Запросить подбор запчастей
        </a>
      </div>
    </section>
  );
}
