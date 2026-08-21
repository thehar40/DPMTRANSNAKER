import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteService } from "@/lib/actions/services";
import { IconBadge } from "@/components/ui/icon-badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Layanan",
};

export default async function AdminServicesPage() {
  const services = await prisma.service
    .findMany({
      orderBy: [{ divisionId: "asc" }, { order: "asc" }, { id: "asc" }],
      include: { division: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kelola Layanan</h2>
          <p className="text-sm text-slate-500">
            Layanan perizinan, penanaman modal, transmigrasi, hubungan
            industrial, dan pelatihan.
          </p>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Layanan
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Layanan</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3 text-center">Urutan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data layanan.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <IconBadge name={service.icon} className="h-9 w-9 rounded-lg" iconClassName="h-5 w-5" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {service.name}
                          </p>
                          <p className="text-xs text-slate-400">{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {service.division.name}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {service.order}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${service.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={service.id}
                          entityName="layanan"
                          onDelete={deleteService}
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
