import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Wrench } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { Markdown } from "@/components/ui/markdown";
import { ServiceCard } from "@/components/public/service-card";
import { ContactCard } from "@/components/public/contact-card";
import { NewsCard } from "@/components/public/news-card";
import { getDivisionBySlug, getPublishedNews, getDivisions } from "@/lib/data";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const divisions = await getDivisions();
  return divisions.map((d) => ({ slug: d.slug }));
}

export const metadata: Metadata = {
  title: "Detail Bidang",
  description:
    "Detail bidang dan unit kerja Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

export default async function DivisionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const division = await getDivisionBySlug(slug);

  if (!division) notFound();

  const relatedNews = await getPublishedNews({
    divisionId: division.id,
    pageSize: 3,
  });

  const primaryContact = division.contacts[0] ?? null;
  const waLink = primaryContact
    ? buildWhatsAppLink(
        primaryContact.whatsapp,
        `Halo, saya ingin bertanya kepada ${division.name}.`
      )
    : null;
  const hasWa = primaryContact
    ? !!normalizePhoneNumber(primaryContact.whatsapp)
    : false;

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-10 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb
            light
            items={[
              { label: "Bidang & Layanan", href: "/bidang" },
              { label: division.name },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="hidden sm:block">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <IconBadge
                    name={division.icon}
                    className="h-14 w-14 !bg-transparent !text-accent-300 !ring-0"
                    iconClassName="h-8 w-8"
                  />
                </div>
              </div>
              <div>
                {division.abbreviation ? (
                  <Badge className="mb-2 bg-white/15 text-accent-200 ring-white/25">
                    {division.abbreviation}
                  </Badge>
                ) : null}
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  {division.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
                  {division.description}
                </p>
              </div>
            </div>
            {hasWa && waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0 !bg-green-500 hover:!bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi Bidang Ini
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {division.duties ? (
              <section aria-labelledby="tupoksi-heading">
                <h2
                  id="tupoksi-heading"
                  className="flex items-center gap-2.5 text-xl font-bold text-slate-900"
                >
                  <Wrench className="h-5 w-5 text-primary-600" />
                  Tugas dan Fungsi
                </h2>
                <div className="card mt-4 p-6">
                  <Markdown content={division.duties} />
                </div>
              </section>
            ) : null}

            <section aria-labelledby="layanan-bidang-heading">
              <h2
                id="layanan-bidang-heading"
                className="text-xl font-bold text-slate-900"
              >
                Layanan Bidang Ini
              </h2>
              {division.services.length === 0 ? (
                <p className="card mt-4 p-6 text-sm text-slate-500">
                  Belum ada layanan aktif pada bidang ini.
                </p>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {division.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={{
                        id: service.id,
                        name: service.name,
                        slug: service.slug,
                        description: service.description,
                        icon: service.icon,
                        division: {
                          name: division.name,
                          slug: division.slug,
                        },
                      }}
                      whatsapp={primaryContact?.whatsapp ?? null}
                    />
                  ))}
                </div>
              )}
            </section>

            {relatedNews.items.length > 0 ? (
              <section aria-labelledby="berita-bidang-heading">
                <h2
                  id="berita-bidang-heading"
                  className="text-xl font-bold text-slate-900"
                >
                  Berita Terkait
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedNews.items.map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside aria-labelledby="kontak-bidang-heading">
            <div className="card sticky top-24 p-5">
              <h2
                id="kontak-bidang-heading"
                className="text-base font-bold text-slate-900"
              >
                Contact Person
              </h2>
              {division.contacts.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Contact person belum tersedia. Gunakan halaman Kontak untuk
                  menghubungi kami.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {division.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      divisionName={division.name}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
