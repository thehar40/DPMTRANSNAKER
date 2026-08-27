"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string;
}

export function GallerySlider({ items }: { items: GalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateArrows() {
    const element = containerRef.current;
    if (!element) return;
    setCanPrev(element.scrollLeft > 4);
    setCanNext(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4
    );
  }

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [items]);

  function scrollByDirection(direction: number) {
    const element = containerRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const interval = window.setInterval(() => {
      const element = containerRef.current;
      if (!element) return;
      const atEnd =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 8;
      element.scrollTo({
        left: atEnd ? 0 : element.scrollLeft + element.clientWidth * 0.85,
        behavior: "smooth",
      });
    }, 5000);
    return () => window.clearInterval(interval);
  }, [paused, items.length]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByDirection(-1)}
          disabled={!canPrev}
          aria-label="Galeri sebelumnya"
          className="btn-icon"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByDirection(1)}
          disabled={!canNext}
          aria-label="Galeri selanjutnya"
          className="btn-icon"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={containerRef}
        onScroll={updateArrows}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {items.map((gallery) => (
          <Link
            key={gallery.id}
            href="/galeri"
            className="group relative block h-48 w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[300px]"
          >
            <SmartImage
              src={gallery.imageUrl}
              alt={gallery.title}
              className="h-full w-full"
              imgClassName="transition duration-500 group-hover:scale-105"
              iconClassName="h-8 w-8"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/10 to-transparent" />
            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-primary-700 opacity-0 shadow-lg transition group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent-200">
                {gallery.category ?? "Dokumentasi"}
              </p>
              <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-white">
                {gallery.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
