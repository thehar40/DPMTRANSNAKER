"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/public/gallery-card";
import { SmartImage } from "@/components/ui/smart-image";
import { Modal } from "@/components/ui/modal";
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
        title={selected?.title ?? "Pratinjau gambar"}
        onClose={() => setSelected(null)}
        size="xl"
      >
        {selected ? (
          <>
            <SmartImage
              src={selected.imageUrl}
              alt={selected.title}
              className="h-[60vh] max-h-[70vh] w-full bg-slate-950"
              imgClassName="object-contain"
              iconClassName="h-16 w-16"
            />
            <div className="p-5">
              {selected.description ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  {selected.description}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
