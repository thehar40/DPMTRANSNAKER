import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  ClipboardList,
  ExternalLink,
  ListChecks,
  MessageCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { Markdown } from "@/components/ui/markdown";
import { ContactCard } from "@/components/public/contact-card";
import { getActiveServices, getServiceBySlug } from "@/lib/data";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";
import { isValidExternalUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((s) => ({ slug: s.slug }));
}

export const metadata: Metadata = {
  title: "Detail Layanan",
  description:
    "Detail layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara beserta persyaratan, prosedur, dan contact person.",
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.status !== "active") notFound();

  const primaryContact = service.division.contacts[0] ?? null;
  const waLink = primaryContact
    ? buildWhatsAppLink(
        primaryContact.whatsapp,
        `Halo, saya ingin bertanya tentang layanan ${service.name}.`
      )
    : null;
  const hasWa = primaryContact
    ? !!normalizePhoneNumber(primaryContact.whatsapp)
    : false;
  const externalUrl = isValidExternalUrl(service.externalUrl)
    ? service.externalUrl!.trim()
    : null;

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb
            light
            items={[
              { label: "Layanan", href: "/layanan" },
              { label: service.name },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="hidden sm:block">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <IconBadge
                    name={service.icon}
                    className="h-14 w-14 !bg-transparent !text-accent-300 !ring-0"
                    iconClassName="h-8 w-8"
                  />
                </div>
              </div>
              <div>
                <Link
                  href={`/bidang/${service.division.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 transition hover:bg-white/20"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {service.division.name}
                </Link>
                <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                  {service.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
                  {service.description}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              {hasWa && waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !bg-green-500 hover:!bg-green-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  Tanya Petugas
                </a>
              ) : null}
              {externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !bg-accent-500 !text-primary-950 hover:!bg-accent-400"
                >
                  <ExternalLink className="h-4 w-4" />
                  {service.externalButtonLabel || "Kunjungi Situs"}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {service.requirements ? (
              <section aria-labelledby="persyaratan-heading">
                <h2
                  id="persyaratan-heading"
                  className="flex items-center gap-2.5 text-xl font-bold text-slate-900"
                >
                  <ListChecks className="h-5 w-5 text-primary-600" />
                  Persyaratan
                </h2>
                <div className="card mt-4 p-6">
                  <Markdown content={service.requirements} />
                </div>
              </section>
            ) : null}

            {service.procedures ? (
              <section aria-labelledby="prosedur-heading">
                <h2
                  id="prosedur-heading"
                  className="flex items-center gap-2.5 text-xl font-bold text-slate-900"
                >
                  <ClipboardList className="h-5 w-5 text-primary-600" />
                  Prosedur Layanan
                </h2>
                <div className="card mt-4 p-6">
                  <Markdown content={service.procedures} />
                </div>
              </section>
            ) : null}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-800">
              <strong>Catatan:</strong> Informasi persyaratan dan prosedur di
              atas merupakan gambaran umum. Ketentuan resmi dapat berubah
              sewaktu-waktu sesuai peraturan yang berlaku. Silakan hubungi
              petugas untuk memastikan persyaratan terkini.
            </div>
          </div>

          <aside aria-labelledby="kontak-layanan-heading">
            <div className="card sticky top-24 p-5">
              <h2
                id="kontak-layanan-heading"
                className="text-base font-bold text-slate-900"
              >
                Contact Person
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {service.division.name}
              </p>
              {service.division.contacts.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Contact person belum tersedia. Gunakan halaman Kontak untuk
                  menghubungi kami.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {service.division.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      divisionName={service.division.name}
                      compact
                    />
                  ))}
                </div>
              )}
              <Link
                href={`/bidang/${service.division.slug}`}
                className="btn-secondary mt-5 w-full"
              >
                <Building2 className="h-4 w-4" />
                Lihat Detail Bidang
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
