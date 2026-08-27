"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Newspaper, GraduationCap, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "berita" | "layanan" | "tutorial" | "bidang";
  title: string;
  slug: string;
  excerpt?: string;
}

const TYPE_META: Record<string, { label: string; icon: typeof Search; color: string; basePath: string }> = {
  berita: { label: "Berita", icon: Newspaper, color: "text-blue-600 bg-blue-50", basePath: "/berita" },
  layanan: { label: "Layanan", icon: FileText, color: "text-emerald-600 bg-emerald-50", basePath: "/layanan" },
  tutorial: { label: "Tutorial", icon: GraduationCap, color: "text-purple-600 bg-purple-50", basePath: "/tutorial" },
  bidang: { label: "Bidang", icon: Building2, color: "text-amber-600 bg-amber-50", basePath: "/bidang" },
};

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'input, button, a, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => { setResults(data.results ?? []); setLoading(false); })
        .catch(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query]);

  // Keyboard navigation
  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      const r = results[activeIndex];
      const meta = TYPE_META[r.type];
      router.push(`${meta.basePath}/${r.slug}`);
      onClose();
    }
  };

  useEffect(() => { setActiveIndex(-1); }, [results]);

  function navigateTo(result: SearchResult) {
    const meta = TYPE_META[result.type];
    router.push(`${meta.basePath}/${result.slug}`);
    onClose();
    setQuery("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-primary-950/80 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Cari berita, layanan, tutorial..."
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            aria-label="Kata kunci pencarian"
          />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="flex h-7 items-center rounded-lg border border-slate-200 px-2 text-[11px] font-medium text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && !loading && results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          ) : null}
          {results.length > 0 ? (
            <ul className="p-2" role="listbox">
              {results.map((result, index) => {
                const meta = TYPE_META[result.type];
                const Icon = meta.icon;
                return (
                  <li key={`${result.type}-${result.slug}`} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      onClick={() => navigateTo(result)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        index === activeIndex
                          ? "bg-primary-50 text-primary-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", meta.color)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{result.title}</p>
                        {result.excerpt ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{result.excerpt}</p>
                        ) : null}
                        <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {meta.label}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {!query.trim() ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Ketik untuk mencari berita, layanan, atau tutorial...
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
