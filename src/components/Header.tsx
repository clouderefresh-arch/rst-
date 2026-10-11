"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { NAV, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-md ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="shrink-0 rounded-md" onClick={close}>
          <Logo className="h-12 w-auto sm:h-14" />
        </a>

        <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Основное меню">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/80 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={PHONE_HREF}
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-white lg:ml-4"
        >
          <Phone className="h-4 w-4 text-orange-400" aria-hidden />
          <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          <span className="sr-only sm:hidden">Позвонить {PHONE_DISPLAY}</span>
        </a>

        <a
          href="#lead"
          className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3.5 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:brightness-110 sm:px-5"
        >
          Заявка
        </a>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-white/15 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={open ? undefined : true}>
          <nav className="border-t border-white/10 px-4 py-2" aria-label="Мобильное меню">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="block border-b border-white/10 py-4 text-lg font-semibold text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl bg-white/5 text-base font-semibold text-white"
            >
              <Phone className="h-4 w-4 text-orange-400" aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
