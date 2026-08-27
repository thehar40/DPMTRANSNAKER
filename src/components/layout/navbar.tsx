"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { SearchModal } from "@/components/layout/search-modal";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/bidang", label: "Bidang & Layanan" },
  { href: "/berita", label: "Berita" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px]">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Beranda Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara"
        >
          <Logo shortName="DPMTRANSNAKER" subtitle="Kabupaten Aceh Utara" />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Menu utama">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-xl px-3 py-2 text-sm font-semibold transition",
                isActive(item.href)
                  ? "bg-primary-50/80 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-700"
              )}
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent-500" />
              ) : null}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="btn-icon ml-1"
            aria-label="Pencarian (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link href="/kontak" className="btn-primary ml-2 !px-4 !py-2">
            Hubungi Kami
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn-icon xl:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white xl:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3" aria-label="Menu seluler">
            <ul className="divide-y divide-slate-100">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-sm font-semibold",
                      isActive(item.href)
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => { setSearchOpen(true); setOpen(false); }}
              className="btn-secondary mt-3 w-full"
            >
              <Search className="h-4 w-4" />
              Cari...
            </button>
            <Link href="/kontak" className="btn-primary mt-3 w-full">
              Hubungi Kami
            </Link>
          </nav>
        </div>
      ) : null}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
