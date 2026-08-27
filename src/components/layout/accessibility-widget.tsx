"use client";

import { useState } from "react";
import { Accessibility, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  function changeFontSize(delta: number) {
    const next = Math.min(150, Math.max(75, fontSize + delta));
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}%`;
  }

  function toggleContrast() {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.classList.toggle("high-contrast", next);
  }

  function reset() {
    setFontSize(100);
    setHighContrast(false);
    document.documentElement.style.fontSize = "";
    document.documentElement.classList.remove("high-contrast");
  }

  return (
    <div className="fixed bottom-24 right-5 z-40 print:hidden">
      {open ? (
        <div className="mb-2 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">Aksesibilitas</p>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-primary-600 hover:text-primary-800 transition"
              aria-label="Reset pengaturan aksesibilitas"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-slate-500">Ukuran Teks</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeFontSize(-10)}
                  disabled={fontSize <= 75}
                  className="btn-icon !h-8 !w-8"
                  aria-label="Perkecil teks"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="flex-1 text-center text-xs font-semibold text-slate-700 tabular-nums">
                  {fontSize}%
                </span>
                <button
                  type="button"
                  onClick={() => changeFontSize(10)}
                  disabled={fontSize >= 150}
                  className="btn-icon !h-8 !w-8"
                  aria-label="Perbesar teks"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={toggleContrast}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-xs font-semibold transition",
                  highContrast
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {highContrast ? "✓ Kontras Tinggi Aktif" : "Kontras Tinggi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          open
            ? "bg-primary-700 text-white ring-4 ring-primary-200"
            : "bg-white text-primary-700 ring-1 ring-slate-200 hover:ring-primary-200 hover:shadow-xl"
        )}
        aria-label={open ? "Tutup menu aksesibilitas" : "Buka menu aksesibilitas"}
      >
        <Accessibility className="h-5 w-5" />
      </button>
    </div>
  );
}
