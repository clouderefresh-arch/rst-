"use client";

import { useState } from "react";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-12 w-auto" }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-white">
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-red-500">Р</span>
          <span className="text-orange-500">Т</span>
          <span className="text-red-500">К</span>
        </span>
        <span className="text-white/35" aria-hidden>
          |
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
          Торговая Компания
        </span>
      </span>
    );
  }

  return (
    // Raster wordmark. onError switches to the styled text mark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="РТК — Торговая компания"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
