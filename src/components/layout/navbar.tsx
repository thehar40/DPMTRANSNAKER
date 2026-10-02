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
] as const;

const BERAKHLAK_TITLE =
  "BerAKHLAK - Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif";

export function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [berakhlakOk, setBerakhlakOk] = useState(true);

  /* =========================================================
     SCROLL EFFECT
  ========================================================= */
  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 4;

      setScrolled((previous) =>
        previous === nextScrolled ? previous : nextScrolled
      );
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ========================================================= */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* =========================================================
     KEYBOARD SHORTCUT
     CTRL + K / CMD + K = SEARCH
     ESC = CLOSE MOBILE MENU
  ========================================================= */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((value) => !value);
        return;
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* =========================================================
     ACTIVE NAVIGATION
     Mencegah /berita-lama dianggap sebagai /berita
  ========================================================= */
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      {/* =====================================================
          MAIN HEADER
      ===================================================== */}
      <div
        className="
          mx-auto
          flex
          min-h-16
          max-w-[1800px]
          items-center
          gap-4
          px-4
          sm:min-h-[80px]
          sm:px-6
          lg:px-8
        "
      >
        {/* ===================================================
            LOGO SI PEUMUDAH
        =================================================== */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Beranda SI PEUMUDAH - Sistem Informasi Pelayanan dan Edukasi Mudah Kabupaten Aceh Utara"
        >
          <Logo
            shortName="SI PEUMUDAH"
            subtitle="Sistem Informasi Pelayanan dan Edukasi Mudah"
          />
        </Link>

        {/* ===================================================
            DESKTOP AREA
            Logo BerAKHLAK dipisahkan dari menu
        =================================================== */}
        <div className="ml-auto hidden items-center xl:flex">
          {/* =================================================
              LOGO BERAKHLAK
              TERPISAH DARI BERANDA
          ================================================= */}
          <div
            className="
              mr-5
              flex
              h-16
              items-center
              border-r
              border-slate-200
              pr-5
            "
          >
            {berakhlakOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/logo-berakhlak.png"
                alt="Logo BerAKHLAK"
                title={BERAKHLAK_TITLE}
                onError={() => setBerakhlakOk(false)}
                className="
                  h-20
                  w-auto
                  max-w-[260px]
                  shrink-0
                  object-contain
                  drop-shadow-sm
                "
              />
            ) : (
              <span className="text-base font-black tracking-tight text-red-700">
                BerAKHLAK
              </span>
            )}
          </div>

          {/* =================================================
              MENU UTAMA
          ================================================= */}
          <nav
            className="flex items-center gap-1"
            aria-label="Menu utama"
          >
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
                  <span
                    className="
                      absolute
                      inset-x-3
                      -bottom-[13px]
                      h-0.5
                      rounded-full
                      bg-accent-500
                    "
                  />
                ) : null}
              </Link>
            ))}

            {/* ===============================================
                SEARCH BUTTON
            =============================================== */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn-icon ml-1"
              aria-label="Pencarian (Ctrl+K)"
              title="Pencarian (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* ===============================================
                CONTACT CTA
            =============================================== */}
            <Link
              href="/kontak"
              className="btn-primary ml-2 !px-4 !py-2"
            >
              Hubungi Kami
            </Link>
          </nav>
        </div>

        {/* ===================================================
            MOBILE MENU BUTTON
        =================================================== */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-icon ml-auto xl:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-controls="mobile-navigation"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}
      {open ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white xl:hidden"
        >
          <nav
            className="mx-auto max-w-7xl px-4 py-3"
            aria-label="Menu seluler"
          >
            {/* ===============================================
                BERAKHLAK MOBILE
            =============================================== */}
            <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-3">
              {berakhlakOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/logo-berakhlak.png"
                  alt="Logo BerAKHLAK"
                  title={BERAKHLAK_TITLE}
                  onError={() => setBerakhlakOk(false)}
                  className="
                    h-11
                    w-auto
                    max-w-[160px]
                    shrink-0
                    object-contain
                  "
                />
              ) : (
                <span className="text-sm font-black tracking-tight text-red-700">
                  BerAKHLAK
                </span>
              )}

              <span className="text-xs font-semibold text-slate-500">
                Budaya Kerja
              </span>
            </div>

            {/* ===============================================
                MOBILE MENU ITEMS
            =============================================== */}
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

            {/* ===============================================
                MOBILE SEARCH
            =============================================== */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
              className="btn-secondary mt-3 flex w-full items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Cari...
            </button>

            {/* ===============================================
                MOBILE CONTACT
            =============================================== */}
            <Link
              href="/kontak"
              className="btn-primary mt-3 block w-full text-center"
            >
              Hubungi Kami
            </Link>
          </nav>
        </div>
      ) : null}

      {/* =====================================================
          SEARCH MODAL
      ===================================================== */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}