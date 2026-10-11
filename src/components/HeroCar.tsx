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
    <div className="relative mx-auto w-full max-w-[720px] lg:max-w-none">
      <div className="aspect-video overflow-hidden rounded-[28px] bg-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-car-poster.jpg"
          width={1280}
          height={720}
          aria-label="Белый кроссовер на фирменном фоне РТК"
        >
          <source src="/hero-car.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
