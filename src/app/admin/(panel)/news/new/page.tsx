import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { NewsForm } from "@/components/admin/forms/news-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Berita",
};

export default async function AdminNewNewsPage() {
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
          href="/admin/news"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Berita
        </Link>
        <h2 className="text-lg font-bold text-slate-900">Tambah Berita</h2>
        <p className="text-sm text-slate-500">
          Buat berita atau pengumuman baru. Konten mendukung format Markdown.
        </p>
      </div>
      <NewsForm divisions={divisions} news={null} />
    </div>
  );
}
