"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ImageSliderProps {
  images: string[];
  alts?: string[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageSlider({
  images,
  alts = [],
  className,
  autoPlay = false,
  autoPlayInterval = 4000,
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = images.length;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, lightboxOpen]);

  // Auto play
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, autoPlayInterval, next, total]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setTouchStart(null);
  };

  if (total === 0) return null;
  if (total === 1) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-2xl bg-slate-100", className)}>
        <div
          className="group relative cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={alts[0] ?? "Gambar"}
            className="w-full object-contain max-h-[480px]"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
            <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow-lg transition group-hover:opacity-100" />
          </div>
        </div>
        <ImageLightbox src={images[0]} alt={alts[0] ?? "Gambar"} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl bg-slate-950 select-none", className)}>
      {/* Slides */}
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              idx === current ? "relative opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            <div
              className="group relative cursor-zoom-in"
              onClick={() => { if (idx === current) setLightboxOpen(true); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alts[idx] ?? `Gambar ${idx + 1}`}
                loading={idx === 0 ? "eager" : "lazy"}
                className="w-full object-contain max-h-[480px]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow-lg transition group-hover:opacity-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Gambar sebelumnya"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Gambar berikutnya"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Counter badge */}
      <div className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        {current + 1} / {total}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Gambar ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx === current ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        src={images[current]}
        alt={alts[current] ?? `Gambar ${current + 1}`}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
