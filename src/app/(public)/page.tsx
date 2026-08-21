import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Hero } from "@/components/public/hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { DivisionCard } from "@/components/public/division-card";
import { NewsCard } from "@/components/public/news-card";
import { TutorialCard } from "@/components/public/tutorial-card";
import { ContactCard } from "@/components/public/contact-card";
import { SmartImage } from "@/components/ui/smart-image";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getActiveContacts,
  getActiveGalleries,
  getActiveServices,
  getDivisions,
  getPublishedNews,
  getPublishedTutorials,
  getSettings,
} from "@/lib/data";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { hasValue } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Beranda",
  description: SITE_DESCRIPTION,
};

const FEATURED_SERVICE_SLUGS = [
  "perizinan-oss",
  "sincantik",
  "lkpm-online",
  "pembangunan-sarana-prasarana-transmigrasi",
  "perselisihan-hubungan-industrial",
  "pelatihan-kompetensi",
];

export default async function HomePage() {
  const [settings, divisions, services, contacts, newsResult, galleries, tutorials] =
    await Promise.all([
      getSettings(),
      getDivisions(),
      getActiveServices(),
      getActiveContacts(),
      getPublishedNews({ pageSize: 3 }),
      getActiveGalleries(),
      getPublishedTutorials({ take: 3 }),
    ]);

  const featuredServices = FEATURED_SERVICE_SLUGS.map((slug) =>
    services.find((s) => s.slug === slug)
  ).filter((s) => !!s);

  const whatsappOf = (divisionId: number) =>
    contacts.find((c) => c.divisionId === divisionId)?.whatsapp ?? null;

  const contactGroups = divisions
    .map((division) => ({
      division,
      contacts: contacts.filter((c) => c.divisionId === division.id),
    }))
    .filter((group) => group.contacts.length > 0);

  return (
    <div>
      <Hero
        tagline={settings.tagline}
        divisionCount={divisions.length}
        serviceCount={services.length}
      />

      {/* Layanan unggulan */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="layanan-heading">
        <SectionHeading
          eyebrow="Layanan Unggulan"
          title="Layanan Kami"
          description="Berbagai layanan perizinan, penanaman modal, transmigrasi, hubungan industrial, dan pelatihan kerja untuk masyarakat dan pelaku usaha."
        />
        <div id="layanan-heading" className="sr-only">
          Layanan Kami
        </div>
        {featuredServices.length === 0 ? (
          <EmptyState
            title="Belum ada layanan"
            description="Layanan akan tampil di sini setelah ditambahkan melalui panel admin."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                whatsapp={whatsappOf(service.divisionId)}
              />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/layanan" className="btn-primary">
            Lihat Semua Layanan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Tutorial layanan */}
      <section className="bg-primary-50/60 py-16 sm:py-20" aria-labelledby="tutorial-heading">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Panduan Video"
            title="Tutorial Layanan"
            description="Ikuti panduan video untuk memahami proses OSS, LKPM Online, AK1, dan layanan lainnya dengan lebih mudah."
          />
          {tutorials.length === 0 ? (
            <EmptyState
              title="Belum ada tutorial"
              description="Video tutorial akan tampil di sini setelah dipublikasikan oleh admin."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href="/tutorial" className="btn-secondary">
              Lihat Semua Tutorial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bidang dinas */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="bidang-heading">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Struktur Dinas"
            title="Bidang & Unit Kerja"
            description="Kenali struktur bidang dan unit kerja Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara."
          />
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
        </div>
      </section>

      {/* Berita terbaru */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="berita-heading">
        <SectionHeading
          eyebrow="Informasi Terkini"
          title="Berita & Pengumuman"
          description="Informasi terbaru seputar kegiatan, pengumuman, dan layanan dinas."
        />
        {newsResult.items.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita dan pengumuman akan tampil di sini setelah dipublikasikan."
            actionHref="/berita"
            actionLabel="Lihat Halaman Berita"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newsResult.items.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/berita" className="btn-secondary">
            Lihat Semua Berita
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Galeri terbaru */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="galeri-heading">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Dokumentasi"
            title="Galeri Kegiatan"
            description="Dokumentasi kegiatan pelayanan, pelatihan, dan sosialisasi dinas."
          />
          {galleries.length === 0 ? (
            <EmptyState
              title="Belum ada galeri"
              description="Foto kegiatan akan tampil di sini setelah ditambahkan melalui panel admin."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleries.slice(0, 4).map((gallery) => (
                <Link
                  key={gallery.id}
                  href="/galeri"
                  className="card group overflow-hidden"
                >
                  <SmartImage
                    src={gallery.imageUrl}
                    alt={gallery.title}
                    className="h-44 w-full"
                    imgClassName="transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      {gallery.title}
                    </h3>
                    {gallery.category ? (
                      <p className="mt-1 text-xs font-medium text-primary-600">
                        {gallery.category}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link href="/galeri" className="btn-secondary">
              Lihat Semua Galeri
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kontak cepat */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20" aria-labelledby="kontak-cepat-heading">
        <SectionHeading
          eyebrow="Hubungi Kami"
          title="Kontak Cepat Bidang"
          description="Hubungi contact person bidang sesuai kebutuhan Anda melalui WhatsApp atau telepon."
        />
        {contactGroups.length === 0 ? (
          <EmptyState
            title="Belum ada contact person"
            description="Kontak bidang akan tampil di sini setelah ditambahkan melalui panel admin."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contactGroups
              .flatMap((group) => group.contacts)
              .map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  divisionName={
                    divisions.find((d) => d.id === contact.divisionId)?.name ??
                    null
                  }
                />
              ))}
          </div>
        )}
      </section>

      {/* Lokasi dan jam layanan */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <h2 className="flex items-center gap-2.5 text-lg font-bold">
              <MapPin className="h-5 w-5 text-accent-300" />
              Lokasi Kantor
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {settings.address}
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-white/15">
              {settings.mapEmbedUrl && hasValue(settings.mapEmbedUrl) ? (
                <iframe
                  src={settings.mapEmbedUrl}
                  title="Peta lokasi kantor dinas"
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center bg-primary-950/50 text-center">
                  <MapPin className="h-10 w-10 text-accent-300/60" />
                  <p className="mt-3 max-w-xs text-sm text-white/60">
                    Peta akan tampil setelah link embed Google Maps diisi pada
                    menu Pengaturan panel admin.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <h2 className="flex items-center gap-2.5 text-lg font-bold">
                <Clock className="h-5 w-5 text-accent-300" />
                Jam Layanan
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                {settings.officeHours}
              </p>
              <p className="mt-2 text-xs text-white/60">
                Mohon maaf jika terdapat penyesuaian pada hari libur nasional
                atau cuti bersama.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <h2 className="flex items-center gap-2.5 text-lg font-bold">
                <Phone className="h-5 w-5 text-accent-300" />
                Hubungi Kami
              </h2>
              {hasValue(settings.phone) ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                  <Phone className="h-4 w-4 text-accent-300" />
                  {settings.phone}
                </p>
              ) : null}
              {hasValue(settings.email) ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                  <Mail className="h-4 w-4 text-accent-300" />
                  {settings.email}
                </p>
              ) : null}
              <Link
                href="/kontak"
                className="btn-primary mt-5 !bg-accent-500 !text-primary-950 hover:!bg-accent-400"
              >
                Buka Halaman Kontak
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
