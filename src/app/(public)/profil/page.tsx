import type { Metadata } from "next";
import { CheckCircle2, Quote, Target, ClipboardList, Award } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { DivisionCard } from "@/components/public/division-card";
import { Markdown } from "@/components/ui/markdown";
import { getActiveContacts, getDivisions, getProfile } from "@/lib/data";
import { hasValue } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Profil Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara: sambutan kepala dinas, visi misi, tugas pokok dan fungsi, struktur organisasi, serta nilai pelayanan.",
};

export default async function ProfilPage() {
  const [profile, divisions, contacts] = await Promise.all([
    getProfile(),
    getDivisions(),
    getActiveContacts(),
  ]);

  const whatsappOf = (divisionId: number) =>
    contacts.find((c) => c.divisionId === divisionId)?.whatsapp ?? null;

  const valueItems = (profile?.serviceValues ?? "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);

  const welcomeName = profile?.welcomeName ?? null;
  const welcomePosition = profile?.welcomePosition ?? null;

  return (
    <div>
      <PageHeader
        title="Profil Dinas"
        description="Kenali lebih dekat Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara."
        breadcrumbs={[{ label: "Profil" }]}
      />

      {/* Sambutan kepala dinas */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_2fr]">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900 p-8 text-center text-white">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 text-3xl font-bold ring-4 ring-accent-400/60">
                {(welcomeName ?? "KD").slice(0, 2).toUpperCase()}
              </div>
              {hasValue(welcomeName) ? (
                <p className="mt-5 text-base font-bold">{welcomeName}</p>
              ) : null}
              {hasValue(welcomePosition) ? (
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  {welcomePosition}
                </p>
              ) : null}
              <div className="mt-6 h-1 w-16 rounded-full bg-accent-400" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
                  <Quote className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {profile?.welcomeTitle ?? "Sambutan Kepala Dinas"}
                </h2>
              </div>
              <div className="prose-content mt-4 whitespace-pre-line text-sm">
                {profile?.welcomeText ?? "Konten sambutan belum diisi."}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi dan misi */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Arah Pembangunan"
            title="Visi dan Misi"
            description="Visi dan misi dinas dalam melaksanakan tugas pelayanan kepada masyarakat."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Visi</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {profile?.vision ?? "Visi belum diisi."}
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Misi</h3>
              </div>
              <div className="mt-4">
                <Markdown content={profile?.mission ?? "Misi belum diisi."} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tupoksi */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Landasan Kerja"
          title="Tugas Pokok dan Fungsi"
          description="Tugas pokok dan fungsi dinas dalam penyelenggaraan urusan pemerintahan daerah."
        />
        <div className="card mx-auto max-w-3xl p-6 sm:p-8">
          <Markdown
            content={profile?.dutiesFunctions ?? "Tugas pokok dan fungsi belum diisi."}
          />
        </div>
      </section>

      {/* Struktur organisasi sederhana */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Organisasi"
            title="Struktur Organisasi"
            description="Struktur organisasi secara sederhana. Detail lengkap mengacu pada peraturan daerah yang berlaku."
          />
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-center">
              <div className="card w-full max-w-sm border-t-4 !border-t-accent-500 p-5 text-center">
                <p className="text-sm font-bold text-primary-800">
                  Kepala Dinas
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {hasValue(welcomeName) ? welcomeName : "[Nama Kepala Dinas]"}
                </p>
              </div>
            </div>
            <div className="my-6 flex justify-center">
              <div className="h-8 w-0.5 bg-slate-300" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {divisions.map((division) => (
                <a
                  key={division.id}
                  href={`/bidang/${division.slug}`}
                  className="card group p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-600">
                    {division.abbreviation ?? "Unit"}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-800 group-hover:text-primary-700">
                    {division.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nilai pelayanan */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Komitmen Kami"
          title="Nilai Pelayanan"
          description="Nilai-nilai yang kami pegang dalam memberikan pelayanan kepada masyarakat."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valueItems.map((item, index) => {
            const [title, ...rest] = item.split(":");
            const description = rest.join(":").trim();
            return (
              <div key={index} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {title.trim()}
                </h3>
                {description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Daftar bidang */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Unit Kerja"
            title="Bidang & Unit Kerja"
            description="Daftar bidang dan unit kerja beserta layanan yang tersedia."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division) => (
              <DivisionCard
                key={division.id}
                division={division}
                whatsapp={whatsappOf(division.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
