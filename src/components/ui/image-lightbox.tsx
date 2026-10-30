"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, open, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, reset]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.max(0.5, Math.min(4, s + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = alt || "gambar";
    a.target = "_blank";
    a.rel = "noopener";
    a.click();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau gambar: ${alt}`}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Toolbar */}
      <div className="absolute right-0 top-0 z-10 flex items-center gap-1 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => setScale((s) => Math.min(s + 0.25, 4))}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          title="Perbesar (Tombol +)"
          aria-label="Perbesar"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          title="Perkecil (Tombol -)"
          aria-label="Perkecil"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          title="Reset ukuran (Tombol 0)"
          aria-label="Reset ukuran"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          title="Unduh gambar"
          aria-label="Unduh gambar"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
          title="Tutup (Esc)"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scale badge */}
      {scale !== 1 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Caption */}
      {alt && (
        <div className="absolute bottom-4 right-4 max-w-xs rounded-xl bg-black/60 px-3 py-2 text-xs text-white/80 hidden sm:block">
          {alt}
        </div>
      )}

      {/* Image */}
      <div
        className={cn(
          "relative max-h-[90vh] max-w-[90vw] select-none",
          isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-zoom-in"
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => { if (scale === 1) setScale(2); }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-transform duration-150"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
        />
      </div>

      {/* Shortcut hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 hidden text-xs text-white/40 sm:block">
        Scroll atau +/− untuk zoom • Klik untuk zoom • Esc untuk tutup
      </div>
    </div>
  );
}
