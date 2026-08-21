import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteContact } from "@/lib/actions/contacts";
import { getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Contact Person",
};

export default async function AdminContactsPage() {
  const contacts = await prisma.contactPerson
    .findMany({
      orderBy: [{ divisionId: "asc" }, { order: "asc" }, { id: "asc" }],
      include: { division: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Kelola Contact Person
          </h2>
          <p className="text-sm text-slate-500">
            Petugas yang dapat dihubungi masyarakat untuk tiap bidang.
          </p>
        </div>
        <Link href="/admin/contacts/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Tambah Contact Person
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3">Telepon / WhatsApp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    Belum ada data contact person.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-xs font-bold text-white">
                          {getInitials(contact.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {contact.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {contact.position}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {contact.division.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <p>{contact.phone}</p>
                      <p className="text-xs text-green-600">{contact.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/contacts/${contact.id}/edit`}
                          className="btn-icon"
                          aria-label={`Edit ${contact.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          id={contact.id}
                          entityName="contact person"
                          onDelete={deleteContact}
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
