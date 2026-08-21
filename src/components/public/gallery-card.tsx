import { Expand } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import type { Gallery } from "@prisma/client";

export function GalleryCard({
  gallery,
  onOpen,
}: {
  gallery: Gallery;
  onOpen: (gallery: Gallery) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(gallery)}
      className="card card-interactive group overflow-hidden text-left"
    >
      <div className="relative">
        <SmartImage
          src={gallery.imageUrl}
          alt={gallery.title}
          className="h-52 w-full"
          imgClassName="transition duration-500 group-hover:scale-105"
          iconClassName="h-12 w-12"
        />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-primary-700 opacity-0 shadow-lg transition group-hover:opacity-100">
          <Expand className="h-4 w-4" />
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900">{gallery.title}</h3>
        {gallery.category ? (
          <p className="mt-1 text-xs font-semibold text-primary-600">
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
  );
}
