import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteDivision } from "@/lib/actions/divisions";
import { IconBadge } from "@/components/ui/icon-badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Bidang",
};

export default async function AdminDivisionsPage() {
  const divisions = await prisma.division
    .findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { _count: { select: { services: true, contacts: true } } },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Bidang</h2>
          <p className="text-sm text-slate-500">
            Struktur bidang dan unit kerja dinas yang tampil di website.
          </p>
        </div>
        <Link href="/admin/divisions/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Bidang
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-center">Urutan</th>
                <th className="px-4 py-3 text-center">Layanan</th>
                <th className="px-4 py-3 text-center">Kontak</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {divisions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data bidang.
                  </td>
                </tr>
              ) : (
                divisions.map((division) => (
                  <tr key={division.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <IconBadge name={division.icon} className="h-9 w-9 rounded-lg" iconClassName="h-5 w-5" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {division.name}
                          </p>
                          {division.abbreviation ? (
                            <p className="text-xs text-slate-400">
                              {division.abbreviation}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{division.slug}</td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {division.order}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {division._count.services}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {division._count.contacts}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/divisions/${division.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${division.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={division.id}
                          entityName="bidang"
                          onDelete={deleteDivision}
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
