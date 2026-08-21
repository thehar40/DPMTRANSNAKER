import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { GalleryForm } from "@/components/admin/forms/gallery-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Galeri",
};

export default async function AdminEditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await prisma.gallery
    .findUnique({ where: { id: Number(id) } })
    .catch(() => null);

  if (!gallery) notFound();

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
        <h2 className="text-lg font-bold text-slate-900">Edit Galeri</h2>
        <p className="text-sm text-slate-500">{gallery.title}</p>
      </div>
      <GalleryForm gallery={gallery} />
    </div>
  );
}
