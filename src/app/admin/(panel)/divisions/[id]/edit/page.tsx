import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DivisionForm } from "@/components/admin/forms/division-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Bidang",
};

export default async function AdminEditDivisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const division = await prisma.division
    .findUnique({ where: { id: Number(id) } })
    .catch(() => null);

  if (!division) notFound();

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
        <h2 className="text-lg font-bold text-slate-900">Edit Bidang</h2>
        <p className="text-sm text-slate-500">{division.name}</p>
      </div>
      <DivisionForm division={division} />
    </div>
  );
}
