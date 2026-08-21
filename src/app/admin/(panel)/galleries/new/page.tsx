import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Galeri",
};

export default function AdminNewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/galleries"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Galeri
        </Link>
        <h2 className="text-lg font-bold text-slate-900">Tambah Galeri</h2>
        <p className="text-sm text-slate-500">
          Tambahkan foto kegiatan. Letakkan file gambar di folder public/images
          dan isi URL dengan /images/nama-file.jpg
        </p>
      </div>
      <GalleryForm gallery={null} />
    </div>
  );
}
