import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { ServiceCard } from "@/components/public/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveContacts, getActiveServices } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Daftar layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara: perizinan OSS, Sincantik, LKPM, transmigrasi, hubungan industrial, PKWT, AK1, CPMI, dan pelatihan kompetensi.",
};

export default async function ServicesPage() {
  const [services, contacts] = await Promise.all([
    getActiveServices(),
    getActiveContacts(),
  ]);

  const whatsappOf = (divisionId: number) =>
    contacts.find((c) => c.divisionId === divisionId)?.whatsapp ?? null;

  return (
    <div>
      <PageHeader
        title="Layanan Kami"
        description="Daftar layanan perizinan, penanaman modal, transmigrasi, hubungan industrial, dan pelatihan kerja yang tersedia untuk masyarakat."
        breadcrumbs={[{ label: "Layanan" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        {services.length === 0 ? (
          <EmptyState
            title="Belum ada layanan"
            description="Daftar layanan akan tampil di sini setelah ditambahkan melalui panel admin."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                whatsapp={whatsappOf(service.divisionId)}
              />
            ))}
          </div>
        )}

        <div className="card mt-12 flex flex-col items-center justify-between gap-4 bg-gradient-to-r from-primary-50 to-accent-50 p-6 sm:flex-row">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Ingin tahu struktur bidang kami?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Lihat daftar bidang dan unit kerja beserta contact person
              masing-masing.
            </p>
          </div>
          <Link href="/bidang" className="btn-primary shrink-0">
            Lihat Bidang & Unit Kerja
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
