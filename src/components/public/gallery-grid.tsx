"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/public/gallery-card";
import { Modal } from "@/components/ui/modal";
import { ImageSlider } from "@/components/public/image-slider";
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
          <GalleryCard
            key={gallery.id}
            gallery={gallery}
            onOpen={setSelected}
          />
        ))}
      </div>

      <Modal
        open={!!selected}
        title={selected?.title ?? "Pratinjau galeri"}
        onClose={() => setSelected(null)}
        size="xl"
      >
        {selected ? (
          <div>
            {(() => {
              const selectedImages = [
                selected.imageUrl,
                ...(selected.images || []),
              ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

              return (
                <div className="overflow-hidden rounded-t-xl bg-slate-950">
                  <ImageSlider
                    images={selectedImages}
                    alts={selectedImages.map((_, i) => `${selected.title} - Foto ${i + 1}`)}
                  />
                </div>
              );
            })()}
            <div className="p-5">
              {selected.category ? (
                <span className="mb-2 inline-block rounded-md bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                  {selected.category}
                </span>
              ) : null}
              {selected.description ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  {selected.description}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
