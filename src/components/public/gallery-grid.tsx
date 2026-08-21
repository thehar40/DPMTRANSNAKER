"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";
import type { Gallery } from "@prisma/client";

export function GalleryGrid({ galleries }: { galleries: Gallery[] }) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(galleries.map((g) => g.category ?? "").filter(Boolean))
      ),
    [galleries]
  );

  const [active, setActive] = useState("");
  const [selected, setSelected] = useState<Gallery | null>(null);

  const filtered = active
    ? galleries.filter((g) => (g.category ?? "") === active)
    : galleries;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div>
      {categories.length > 1 ? (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActive("")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
              active === ""
                ? "bg-primary-700 text-white ring-primary-700"
                : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
            )}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                active === category
                  ? "bg-primary-700 text-white ring-primary-700"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((gallery) => (
          <button
            key={gallery.id}
            type="button"
            onClick={() => setSelected(gallery)}
            className="card group overflow-hidden text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <SmartImage
              src={gallery.imageUrl}
              alt={gallery.title}
              className="h-52 w-full"
              imgClassName="transition duration-500 group-hover:scale-105"
              iconClassName="h-12 w-12"
            />
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-900">
                {gallery.title}
              </h3>
              {gallery.category ? (
                <p className="mt-1 text-xs font-medium text-primary-600">
                  {gallery.category}
                </p>
              ) : null}
              {gallery.description ? (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {gallery.description}
                </p>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau gambar ${selected.title}`}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup pratinjau"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
            <SmartImage
              src={selected.imageUrl}
              alt={selected.title}
              className="max-h-[70vh] w-full"
              imgClassName="object-contain"
              iconClassName="h-16 w-16"
            />
            <div className="p-5">
              <h3 className="text-base font-bold text-slate-900">
                {selected.title}
              </h3>
              {selected.description ? (
                <p className="mt-1 text-sm text-slate-600">
                  {selected.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
