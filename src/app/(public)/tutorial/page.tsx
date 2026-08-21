import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { TutorialCard } from "@/components/public/tutorial-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedTutorials } from "@/lib/data";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tutorial",
  description:
    "Video tutorial layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara, termasuk panduan OSS, LKPM Online, AK1, dan layanan lainnya.",
};

export default async function TutorialPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = (params.category ?? "").trim();
  const tutorials = await getPublishedTutorials();
  const categories = Array.from(
    new Set(tutorials.map((tutorial) => tutorial.category).filter(Boolean))
  );
  const filtered = category
    ? tutorials.filter((tutorial) => tutorial.category === category)
    : tutorials;

  return (
    <div>
      <PageHeader
        title="Tutorial Layanan"
        description="Panduan video untuk membantu masyarakat memahami proses layanan perizinan, pelaporan penanaman modal, dan layanan ketenagakerjaan."
        breadcrumbs={[{ label: "Tutorial" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
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

        {categories.length > 1 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/tutorial"
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
                href={`/tutorial?category=${encodeURIComponent(item)}`}
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
        ) : null}

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={category ? "Tutorial tidak ditemukan" : "Belum ada tutorial"}
            description={
              category
                ? "Belum ada tutorial pada kategori yang dipilih."
                : "Tutorial akan tampil di sini setelah dipublikasikan oleh admin."
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
