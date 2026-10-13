"use client";

import { useEffect, useRef } from "react";

export function HeroCar() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (media.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => undefined);
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <video
        ref={videoRef}
        className="h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-truck-poster.jpg"
        width={1280}
        height={720}
      >
        <source src="/hero-truck.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/25 lg:bg-gradient-to-r lg:from-ink lg:via-ink/75 lg:via-40% lg:to-transparent" />
    </div>
  );
}
