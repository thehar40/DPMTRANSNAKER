import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Hero } from "@/components/public/hero";
import { InfoTicker } from "@/components/public/info-ticker";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { DivisionCard } from "@/components/public/division-card";
import { TutorialCard } from "@/components/public/tutorial-card";
import { ContactCard } from "@/components/public/contact-card";
import { NewsSlider } from "@/components/public/news-slider";
import { GallerySlider } from "@/components/public/gallery-slider";
import { MapPreview } from "@/components/public/map-preview";
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
import { getMapCoordinates } from "@/lib/map-coords";
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
      getPublishedNews({ pageSize: 6 }),
      getActiveGalleries(),
      getPublishedTutorials({ take: 3 }),
    ]);
  const coordinates = await getMapCoordinates(settings.mapEmbedUrl);

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

      <InfoTicker coordinates={coordinates} />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-6" aria-label="Keunggulan layanan">
        <div className="card grid gap-4 p-4 shadow-xl sm:grid-cols-3 sm:p-5">
          {[
            {
              title: "Informasi terarah",
              text: "Temukan layanan dan bidang sesuai kebutuhan.",
              icon: CheckCircle2,
            },
            {
              title: "Panduan praktis",
              text: "Ikuti tutorial video untuk memahami alur layanan.",
              icon: ArrowRight,
            },
            {
              title: "Kontak responsif",
              text: "Hubungi contact person bidang secara langsung.",
              icon: Phone,
            },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-xl p-2 sm:p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Informasi terkini: Berita di kiri, Galeri di kanan */}
      <section className="surface-grid mx-auto max-w-7xl px-4 py-8 sm:py-10" aria-labelledby="informasi-terkini-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-kicker">Informasi Terkini</p>
                <h2 id="informasi-terkini-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Berita &amp; Pengumuman
                </h2>
              </div>
              <Link href="/berita" className="btn-secondary !py-1.5 text-xs">
                Lihat Semua
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {newsResult.items.length === 0 ? (
              <EmptyState
                title="Belum ada berita"
                description="Berita dan pengumuman akan tampil di sini setelah dipublikasikan."
              />
            ) : (
              <NewsSlider items={newsResult.items} />
            )}
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-kicker">Dokumentasi</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Galeri Kegiatan
                </h2>
              </div>
              <Link href="/galeri" className="btn-secondary !py-1.5 text-xs">
                Lihat Semua
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {galleries.length === 0 ? (
              <EmptyState
                title="Belum ada galeri"
                description="Foto kegiatan akan tampil di sini setelah ditambahkan melalui panel admin."
              />
            ) : (
              <GallerySlider items={galleries} />
            )}
          </div>
        </div>
      </section>

      {/* Panduan video - Tutorial layanan */}
      <section className="surface-grid bg-primary-50/60 py-8 sm:py-10" aria-labelledby="tutorial-heading">
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

      {/* Layanan unggulan */}
      <section className="surface-grid mx-auto max-w-7xl px-4 py-10 sm:py-12" aria-labelledby="layanan-heading">
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

      {/* Bidang dinas */}
      <section className="bg-white py-8 sm:py-10" aria-labelledby="bidang-heading">
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

      {/* Kontak cepat */}
      <section className="surface-grid mx-auto max-w-7xl px-4 py-8 sm:py-10" aria-labelledby="kontak-cepat-heading">
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
      <section className="hero-grid py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <h2 className="flex items-center gap-2.5 text-lg font-bold">
              <MapPin className="h-5 w-5 text-accent-300" />
              Lokasi Kantor
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {settings.address}
            </p>
            <div className="mt-5">
              <MapPreview url={settings.mapEmbedUrl} location={settings.address} dark />
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
