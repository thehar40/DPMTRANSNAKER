import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteGallery } from "@/lib/actions/galleries";
import { SmartImage } from "@/components/ui/smart-image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Galeri",
};

export default async function AdminGalleriesPage() {
  const galleries = await prisma.gallery
    .findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Galeri</h2>
          <p className="text-sm text-slate-500">
            Foto kegiatan yang tampil pada halaman Galeri dan beranda.
          </p>
        </div>
        <Link href="/admin/galleries/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Galeri
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Gambar</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-center">Urutan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {galleries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data galeri.
                  </td>
                </tr>
              ) : (
                galleries.map((gallery) => (
                  <tr key={gallery.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <SmartImage
                        src={gallery.imageUrl}
                        alt={gallery.title}
                        className="h-12 w-16 rounded-lg"
                        iconClassName="h-5 w-5"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {gallery.title}
                      </p>
                      {gallery.description ? (
                        <p className="max-w-xs truncate text-xs text-slate-400">
                          {gallery.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {gallery.category ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {gallery.order}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={gallery.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/galleries/${gallery.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${gallery.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={gallery.id}
                          entityName="galeri"
                          onDelete={deleteGallery}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
