import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TutorialForm } from "@/components/admin/forms/tutorial-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Tutorial",
};

export default function AdminNewTutorialPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/tutorials"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Tutorial
        </Link>
        <h2 className="text-lg font-bold text-slate-900">Tambah Tutorial</h2>
        <p className="text-sm text-slate-500">
          Tambahkan panduan video baru untuk masyarakat.
        </p>
      </div>
      <TutorialForm tutorial={null} />
    </div>
  );
}
