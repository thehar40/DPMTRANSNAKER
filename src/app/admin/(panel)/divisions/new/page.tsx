import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DivisionForm } from "@/components/admin/forms/division-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Bidang",
};

export default function AdminNewDivisionPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/divisions"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Bidang
        </Link>
        <h2 className="text-lg font-bold text-slate-900">Tambah Bidang</h2>
        <p className="text-sm text-slate-500">
          Tambahkan bidang atau unit kerja baru.
        </p>
      </div>
      <DivisionForm division={null} />
    </div>
  );
}
