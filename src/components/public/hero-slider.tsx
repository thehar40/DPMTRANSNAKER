"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { NEWS_CATEGORY_STYLES } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

interface HeroSliderItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
}

export function HeroSlider({ items }: { items: HeroSliderItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused || items.length <= 1) return;
    const interval = window.setInterval(() => emblaApi.scrollNext(), 5000);
    return () => window.clearInterval(interval);
  }, [emblaApi, paused, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden rounded-2xl shadow-xl">
        <div className="flex">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative h-[300px] min-w-0 flex-[0_0_100%] sm:h-[400px]"
            >
              <SmartImage
                src={item.coverImage}
                alt={item.title}
                className="absolute inset-0 h-full w-full"
                iconClassName="h-14 w-14 text-white/40"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/40 to-primary-950/5"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 pb-14 sm:p-8 sm:pb-16">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      NEWS_CATEGORY_STYLES[item.category] ??
                      NEWS_CATEGORY_STYLES.Umum
                    }
                  >
                    {item.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/75">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(item.publishedAt)}
                  </span>
                </div>
                <h2 className="mt-3 line-clamp-2 max-w-3xl text-xl font-extrabold leading-snug text-white sm:text-2xl lg:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:line-clamp-2">
                  {item.excerpt}
                </p>
                <Link
                  href={`/berita/${item.slug}`}
                  className="btn-primary mt-4 !bg-accent-500 !px-4 !py-2 !text-primary-950 hover:!bg-accent-400"
                >
                  Baca Selengkapnya
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Slide sebelumnya"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white backdrop-blur-md bg-white/20 transition hover:bg-white/40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Slide selanjutnya"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white backdrop-blur-md bg-white/20 transition hover:bg-white/40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ke slide ${index + 1}`}
                aria-current={index === selected}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === selected
                    ? "w-6 bg-accent-400"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
