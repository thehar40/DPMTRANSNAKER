import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ServiceForm } from "@/components/admin/forms/service-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Layanan",
};

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [service, divisions] = await Promise.all([
    prisma.service.findUnique({ where: { id: Number(id) } }).catch(() => null),
    prisma.division
      .findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, name: true },
      })
      .catch(() => []),
  ]);

  if (!service) notFound();

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
        <h2 className="text-lg font-bold text-slate-900">Edit Layanan</h2>
        <p className="text-sm text-slate-500">{service.name}</p>
      </div>
      <ServiceForm divisions={divisions} service={service} />
    </div>
  );
}
