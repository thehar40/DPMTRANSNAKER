import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { DivisionCard } from "@/components/public/division-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveContacts, getDivisions } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bidang & Layanan",
  description:
    "Struktur bidang dan unit kerja Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara beserta layanan masing-masing bidang.",
};

export default async function DivisionsPage() {
  const [divisions, contacts] = await Promise.all([
    getDivisions(),
    getActiveContacts(),
  ]);

  const whatsappOf = (divisionId: number) =>
    contacts.find((c) => c.divisionId === divisionId)?.whatsapp ?? null;

  return (
    <div>
      <PageHeader
        title="Bidang & Layanan"
        description="Struktur bidang dan unit kerja Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara."
        breadcrumbs={[{ label: "Bidang & Layanan" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        {divisions.length === 0 ? (
          <EmptyState
            title="Belum ada bidang"
            description="Data bidang akan tampil di sini setelah ditambahkan melalui panel admin."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division) => (
              <DivisionCard
                key={division.id}
                division={division}
                whatsapp={whatsappOf(division.id)}
              />
            ))}
          </div>
        )}

        <div className="card mt-12 flex flex-col items-center justify-between gap-4 bg-gradient-to-r from-primary-50 to-accent-50 p-6 sm:flex-row">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Mencari layanan tertentu?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Lihat seluruh daftar layanan dari semua bidang dalam satu halaman.
            </p>
          </div>
          <Link href="/layanan" className="btn-primary shrink-0">
            Lihat Semua Layanan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
