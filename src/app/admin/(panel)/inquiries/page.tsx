import type { Metadata } from "next";
import Link from "next/link";
import { Check, Eye } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  deleteInquiry,
  updateInquiryStatus,
} from "@/lib/actions/inquiries";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pertanyaan Masuk",
};

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "new", label: "Baru" },
  { value: "read", label: "Dibaca" },
  { value: "done", label: "Selesai" },
];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";

  const [inquiries, divisions] = await Promise.all([
    prisma.inquiry
      .findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.division.findMany({ select: { id: true, name: true } }).catch(() => []),
  ]);

  const divisionName = (id: number | null) =>
    id ? divisions.find((d) => d.id === id)?.name ?? "-" : "-";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Pertanyaan Masuk</h2>
        <p className="text-sm text-slate-500">
          Pesan dari formulir kontak website. Tandai status untuk memantau
          penanganan.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value ? `/admin/inquiries?status=${filter.value}` : "/admin/inquiries"}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
              status === filter.value
                ? "bg-primary-700 text-white ring-primary-700"
                : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Pengirim</th>
                <th className="px-4 py-3">Subjek</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3">Masuk</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada pertanyaan masuk.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="font-semibold text-slate-900 hover:text-primary-700"
                      >
                        {inquiry.name}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {inquiry.email ?? inquiry.phone ?? "-"}
                      </p>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate text-slate-700">{inquiry.subject}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {divisionName(inquiry.divisionId)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(inquiry.createdAt, "d MMM yyyy, HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="btn-icon"
                          aria-label={`Lihat detail ${inquiry.subject}`}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {inquiry.status === "new" ? (
                          <form
                            action={async (fd: FormData) => {
                              "use server";
                              await updateInquiryStatus(fd);
                            }}
                          >
                            <input type="hidden" name="id" value={inquiry.id} />
                            <input type="hidden" name="status" value="read" />
                            <button
                              type="submit"
                              className="btn-icon"
                              aria-label="Tandai dibaca"
                              title="Tandai Dibaca"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </form>
                        ) : null}
                        <DeleteButton
                          id={inquiry.id}
                          entityName="pertanyaan"
                          onDelete={deleteInquiry}
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
