import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Image, Sparkles } from "lucide-react";
import { getActiveGalleries } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Galeri foto kegiatan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

export default async function GalleryPage() {
  const galleries = await getActiveGalleries();

  return (
    <div>
      <PageHeader
        title="Galeri Kegiatan"
        description="Dokumentasi foto kegiatan pelayanan, pelatihan, sosialisasi, dan program kerja dinas."
        breadcrumbs={[{ label: "Galeri" }]}
      />

      <section className="surface-grid mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-primary-100 bg-white/80 p-5 shadow-sm sm:p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Image className="h-5 w-5" />
          </div>
          <div>
            <p className="section-kicker">Dokumentasi Visual</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Momen pelayanan dan kegiatan dinas
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Jelajahi dokumentasi kegiatan yang telah dipublikasikan oleh
              admin.
            </p>
          </div>
          <Sparkles className="ml-auto hidden h-5 w-5 text-accent-500 sm:block" />
        </div>
        {galleries.length === 0 ? (
          <EmptyState
            title="Belum ada galeri"
            description="Foto kegiatan akan tampil di sini setelah ditambahkan melalui panel admin."
          />
        ) : (
          <GalleryGrid galleries={galleries} />
        )}
      </section>
    </div>
  );
}
