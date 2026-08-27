import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PlayCircle, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { TutorialCard } from "@/components/public/tutorial-card";
import { LearningPath } from "@/components/public/learning-path";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedTutorials } from "@/lib/data";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const CATEGORY_FILTERS = [
  "Perizinan",
  "Penanaman Modal",
  "Ketenagakerjaan",
  "Transmigrasi",
  "Hubungan Industrial",
];

export const metadata: Metadata = {
  title: "Tutorial",
  description:
    "Video tutorial layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara, termasuk panduan OSS, LKPM Online, AK1, dan layanan lainnya.",
};

export default async function TutorialPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = (params.category ?? "").trim();
  const query = (params.q ?? "").trim();
  const tutorials = await getPublishedTutorials();
  const categories = Array.from(
    new Set([
      ...CATEGORY_FILTERS,
      ...tutorials.map((tutorial) => tutorial.category).filter(Boolean),
    ])
  );
  const normalizedQuery = query.toLowerCase();
  const filtered = tutorials.filter((tutorial) => {
    const matchesCategory = !category || tutorial.category === category;
    const matchesQuery =
      !normalizedQuery ||
      [tutorial.title, tutorial.description, tutorial.category].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    return matchesCategory && matchesQuery;
  });
  const popular = tutorials.slice(0, 3);
  const buildCategoryHref = (value: string) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (value) search.set("category", value);
    const queryString = search.toString();
    return queryString ? `/tutorial?${queryString}` : "/tutorial";
  };

  return (
    <div>
      <PageHeader
        title="Tutorial & Panduan Layanan"
        description="Panduan video yang ringkas dan mudah diikuti untuk membantu masyarakat memahami proses layanan perizinan, penanaman modal, dan ketenagakerjaan."
        breadcrumbs={[{ label: "Tutorial" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-white to-accent-50 p-6 ring-1 ring-primary-100 sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-accent-400/15 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-lg shadow-primary-700/20">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
                  Pusat Panduan
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Belajar layanan melalui video
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                  Pilih tutorial sesuai kebutuhan. Video akan diperbarui oleh
                  admin menggunakan materi resmi dinas.
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/80 px-5 py-3 text-center ring-1 ring-primary-100">
              <p className="text-2xl font-extrabold text-primary-700">
                {tutorials.length}
              </p>
              <p className="text-xs font-medium text-slate-500">
                tutorial tersedia
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form action="/tutorial" method="get" className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Cari tutorial OSS, LKPM, AK1..."
                aria-label="Cari tutorial"
                className="input !pl-10"
              />
            </div>
            <button type="submit" className="btn-primary sm:px-6">
              Cari Tutorial
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter:
            </span>
            <Link
              href={buildCategoryHref("")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                !category
                  ? "bg-primary-700 text-white ring-primary-700"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              )}
            >
              Semua
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={buildCategoryHref(item)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                  category === item
                    ? "bg-primary-700 text-white ring-primary-700"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                )}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {!category && !query && popular.length > 0 ? (
          <section className="mb-12" aria-labelledby="tutorial-populer-heading">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="section-kicker">Pilihan Panduan</p>
                <h2 id="tutorial-populer-heading" className="mt-2 text-2xl font-bold text-slate-900">
                  Tutorial Populer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Materi yang paling relevan untuk memulai proses layanan Anda.
                </p>
              </div>
              <Sparkles className="hidden h-6 w-6 text-accent-500 sm:block" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((tutorial, index) => (
                <TutorialCard
                  key={`popular-${tutorial.id}`}
                  tutorial={tutorial}
                  ribbon={index === 0 ? "Terbaru" : "Pilihan"}
                />
              ))}
            </div>
          </section>
        ) : null}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Koleksi Video</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {category || query ? "Hasil Pencarian Tutorial" : "Semua Tutorial"}
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            {filtered.length} tutorial
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={category ? "Tutorial tidak ditemukan" : "Belum ada tutorial"}
            description={
              category || query
                ? "Belum ada tutorial yang cocok. Coba kata kunci atau kategori lain."
                : "Tutorial akan segera hadir. Pantau terus halaman ini."
            }
            actionHref="/kontak"
            actionLabel="Hubungi Kami"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
          </div>
        )}

        {!category && !query ? (
          <div className="mt-14">
            <LearningPath availableSlugs={tutorials.map((tutorial) => tutorial.slug)} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
