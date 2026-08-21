import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { EmptyState } from "@/components/ui/empty-state";
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

      <section className="mx-auto max-w-7xl px-4 py-12">
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
