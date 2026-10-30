"use client";

import { useState } from "react";
import { ZoomIn, ImageIcon } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface NewsDetailImageProps {
  src: string | null;
  alt: string;
}

export function NewsDetailImage({ src, alt }: NewsDetailImageProps) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasImage = !!src && src.trim() !== "" && !failed;

  return (
    <>
      <div className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200">
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={() => setFailed(true)}
              className="w-full object-contain max-h-[480px] transition duration-500 group-hover:scale-[1.02]"
              style={{ display: "block" }}
            />
            {/* Overlay click hint */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/25"
              aria-label="Klik untuk memperbesar gambar"
            >
              <span className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
                Perbesar Gambar
              </span>
            </button>
          </>
        ) : (
          <div className="flex h-64 w-full items-center justify-center sm:h-80">
            <ImageIcon className="h-16 w-16 text-primary-400" aria-hidden="true" />
          </div>
        )}
      </div>

      {hasImage && (
        <ImageLightbox
          src={src!}
          alt={alt}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
