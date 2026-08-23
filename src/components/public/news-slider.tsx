"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/public/news-card";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  division: { name: string; slug: string } | null;
}

export function NewsSlider({ items }: { items: NewsItem[] }) {
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
    >
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByDirection(-1)}
          disabled={!canPrev}
          aria-label="Berita sebelumnya"
          className="btn-icon"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByDirection(1)}
          disabled={!canNext}
          aria-label="Berita selanjutnya"
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
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[290px] shrink-0 snap-start sm:w-[330px]"
          >
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
