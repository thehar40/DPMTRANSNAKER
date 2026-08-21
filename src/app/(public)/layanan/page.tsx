import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { ServiceCard } from "@/components/public/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
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
  const divisionCount = new Set(services.map((service) => service.divisionId)).size;

  return (
    <div>
      <PageHeader
        title="Layanan Kami"
        description="Daftar layanan perizinan, penanaman modal, transmigrasi, hubungan industrial, dan pelatihan kerja yang tersedia untuk masyarakat."
        breadcrumbs={[{ label: "Layanan" }]}
      />

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Briefcase}
            value={services.length}
            label="Layanan tersedia"
            description="Informasi layanan yang dapat diakses masyarakat."
          />
          <StatCard
            icon={Building2}
            value={divisionCount}
            label="Bidang terkait"
            description="Unit kerja yang menangani layanan."
          />
          <StatCard
            icon={ShieldCheck}
            value="Terpadu"
            label="Komitmen pelayanan"
            description="Profesional, transparan, dan akuntabel."
          />
        </div>
      </section>

      <section className="surface-grid mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <SectionHeading
          align="left"
          eyebrow="Pusat Layanan"
          title="Temukan layanan sesuai kebutuhan Anda"
          description="Pilih layanan untuk melihat persyaratan, prosedur, tautan aplikasi, dan contact person bidang terkait."
        />
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

        <div className="card mt-14 flex flex-col items-center justify-between gap-5 overflow-hidden bg-gradient-to-r from-primary-50 via-white to-accent-50 p-6 sm:flex-row sm:p-8">
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
