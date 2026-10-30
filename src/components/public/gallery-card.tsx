import { Expand, Layers } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import type { Gallery } from "@prisma/client";

export function GalleryCard({
  gallery,
  onOpen,
}: {
  gallery: Gallery;
  onOpen: (gallery: Gallery) => void;
}) {
  const images = [gallery.imageUrl, ...(gallery.images || [])].filter(
    (v, i, a) => Boolean(v) && a.indexOf(v) === i
  );
  const totalImages = images.length;

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
        {totalImages > 1 && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-md">
            <Layers className="h-3.5 w-3.5 text-accent-300" />
            {totalImages} Foto
          </span>
        )}
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
