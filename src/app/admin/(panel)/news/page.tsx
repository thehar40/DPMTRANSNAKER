import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteNews } from "@/lib/actions/news";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Berita",
};

export default async function AdminNewsPage() {
  const news = await prisma.news
    .findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      include: { division: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Berita</h2>
          <p className="text-sm text-slate-500">
            Berita dan pengumuman yang tampil di website. Berita berstatus
            Draft tidak tampil untuk publik.
          </p>
        </div>
        <Link href="/admin/news/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Berita
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3">Terbit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data berita.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/60">
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {item.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.division?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(item.publishedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={item.id}
                          entityName="berita"
                          onDelete={deleteNews}
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
