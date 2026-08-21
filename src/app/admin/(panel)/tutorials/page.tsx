import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, PlayCircle, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { SmartImage } from "@/components/ui/smart-image";
import { deleteTutorial } from "@/lib/actions/tutorials";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Tutorial",
};

export default async function AdminTutorialsPage() {
  const tutorials = await prisma.tutorial
    .findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }, { id: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Tutorial</h2>
          <p className="text-sm text-slate-500">
            Kelola video panduan OSS, LKPM Online, AK1, dan layanan lainnya.
          </p>
        </div>
        <Link href="/admin/tutorials/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Tutorial
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Tutorial</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Terbit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tutorials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data tutorial.
                  </td>
                </tr>
              ) : (
                tutorials.map((tutorial) => (
                  <tr key={tutorial.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={tutorial.thumbnailUrl}
                          alt={tutorial.title}
                          className="h-12 w-20 shrink-0 rounded-lg"
                          iconClassName="h-5 w-5"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {tutorial.title}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {tutorial.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {tutorial.category}
                    </td>
                    <td className="px-4 py-3">
                      {tutorial.videoUrl ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <PlayCircle className="h-4 w-4" />
                          Tersedia
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(tutorial.publishedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tutorial.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/tutorials/${tutorial.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${tutorial.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={tutorial.id}
                          entityName="tutorial"
                          onDelete={deleteTutorial}
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
