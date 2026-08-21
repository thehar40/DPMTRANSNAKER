import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ServiceForm } from "@/components/admin/forms/service-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Layanan",
};

export default async function AdminNewServicePage() {
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
          href="/admin/services"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Layanan
        </Link>
        <h2 className="text-lg font-bold text-slate-900">Tambah Layanan</h2>
        <p className="text-sm text-slate-500">Tambahkan layanan baru.</p>
      </div>
      <ServiceForm divisions={divisions} service={null} />
    </div>
  );
}
