import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/admin/forms/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Contact Person",
};

export default async function AdminNewContactPage() {
  const divisions = await prisma.division
    .findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, name: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/contacts"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Contact Person
        </Link>
        <h2 className="text-lg font-bold text-slate-900">
          Tambah Contact Person
        </h2>
        <p className="text-sm text-slate-500">
          Tambahkan petugas yang dapat dihubungi masyarakat.
        </p>
      </div>
      <ContactForm divisions={divisions} contact={null} />
    </div>
  );
}
