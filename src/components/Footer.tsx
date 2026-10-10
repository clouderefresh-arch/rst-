import { Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MAP_EMBED, MAP_LINK, NAV, PHONE_DISPLAY, PHONE_HREF, SERVICE_ADDRESS, WORK_HOURS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <section id="contacts" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="overflow-hidden rounded-[28px] bg-slate-100 shadow-card ring-1 ring-slate-200">
            <iframe
              title="Карта сервиса ООО «РТК»"
              src={MAP_EMBED}
              className="h-[320px] w-full sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col rounded-[28px] bg-ink p-6 text-white sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">ООО «РТК»</p>
            <h2 className="mt-2 text-3xl font-extrabold">Контакты</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Торговая компания. Сервис и поставка запчастей в Подольске и Климовске.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden />
                <span>
                  <span className="block font-semibold">Города обслуживания</span>
                  <span className="text-white/75">Подольск и Климовск</span>
                  <span className="mt-1 block text-white/75">{SERVICE_ADDRESS}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden />
                <span>
                  <span className="block font-semibold">Телефоны для связи</span>
                  <a href={PHONE_HREF} className="text-lg font-bold text-white">
                    {PHONE_DISPLAY}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden />
                <span>
                  <span className="block font-semibold">График работы</span>
                  <span className="text-white/75">{WORK_HOURS}</span>
                </span>
              </li>
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <a
                href="#lead"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-sm font-semibold text-white"
              >
                Повторная запись
              </a>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white ring-1 ring-white/15"
              >
                Открыть в Яндекс.Картах
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#070a12] text-white/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              ООО «РТК». Торговая компания. Ремонт легкового и грузового транспорта, спецтехники, поставки
              запчастей оптом и в розницу.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Разделы</p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div id="privacy">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Реквизиты и данные</p>
            <p className="mt-4 text-sm leading-relaxed">
              ООО «РТК». {SERVICE_ADDRESS}. Города обслуживания: Подольск и Климовск. Телефон: {PHONE_DISPLAY}.
              График: {WORK_HOURS.toLowerCase()}. Полные реквизиты для договора направляем по запросу.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Отправляя заявку, вы соглашаетесь на обработку персональных данных — имени, телефона, сведений об
              автомобиле и описания обращения — только для связи по этой заявке. Данные не используются для
              рассылок.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© {year} ООО «РТК». Все права защищены.</p>
            <p>Информация на сайте не является публичной офертой.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
