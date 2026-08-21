import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/ui/markdown";
import { TutorialCard } from "@/components/public/tutorial-card";
import { ContactCard } from "@/components/public/contact-card";
import { TutorialPlayer } from "@/components/public/tutorial-player";
import { TutorialShare } from "@/components/public/tutorial-share";
import { TutorialToc } from "@/components/public/tutorial-toc";
import {
  getActiveContacts,
  getPublishedTutorials,
  getTutorialBySlug,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const tutorials = await getPublishedTutorials();
  return tutorials.map((tutorial) => ({ slug: tutorial.slug }));
}

export const metadata: Metadata = {
  title: "Detail Tutorial",
  description:
    "Detail video tutorial layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tutorial, allTutorials, contacts] = await Promise.all([
    getTutorialBySlug(slug),
    getPublishedTutorials(),
    getActiveContacts(),
  ]);
  if (!tutorial) notFound();

  const related = allTutorials
    .filter(
      (item) => item.category === tutorial.category && item.id !== tutorial.id
    )
    .slice(0, 3);
  const currentIndex = allTutorials.findIndex((item) => item.id === tutorial.id);
  const previous = currentIndex > 0 ? allTutorials[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < allTutorials.length - 1
      ? allTutorials[currentIndex + 1]
      : null;
  const categoryDivisionSlug: Record<string, string> = {
    Perizinan: "pelayanan-terpadu-satu-pintu",
    "Penanaman Modal": "penanaman-modal",
    Ketenagakerjaan: "hubungan-industrial-dan-persyaratan-kerja",
    "Hubungan Industrial": "hubungan-industrial-dan-persyaratan-kerja",
    Transmigrasi: "transmigrasi",
  };
  const contact = contacts.find(
    (item) => item.division.slug === categoryDivisionSlug[tutorial.category]
  );

  return (
    <div>
      <section className="page-header-grid py-10 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <Breadcrumb
            light
            items={[{ label: "Tutorial", href: "/tutorial" }, { label: tutorial.title }]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge className="bg-white/15 text-accent-200 ring-white/25">
              <PlayCircle className="h-3.5 w-3.5" />
              {tutorial.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/75">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(tutorial.publishedAt)}
            </span>
            {tutorial.duration ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-white/75">
                <Clock3 className="h-3.5 w-3.5" />
                {tutorial.duration}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">
            {tutorial.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            {tutorial.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <TutorialPlayer
              videoUrl={tutorial.videoUrl}
              thumbnailUrl={tutorial.thumbnailUrl}
              title={tutorial.title}
            />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">
                Bagikan panduan ini kepada rekan Anda
              </p>
              <TutorialShare title={tutorial.title} />
            </div>
            {tutorial.content ? (
              <div className="card mt-8 p-6 sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Tentang Tutorial Ini
                </h2>
                <Markdown content={tutorial.content} />
              </div>
            ) : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/tutorial/${previous.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tutorial Sebelumnya
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-primary-700">
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">{previous.title}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/tutorial/${next.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tutorial Berikutnya
                  </span>
                  <span className="mt-2 flex items-center justify-end gap-2 text-sm font-bold text-slate-800 group-hover:text-primary-700">
                    <span className="line-clamp-2">{next.title}</span>
                    <span className="text-lg">&rarr;</span>
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="mt-8 border-t border-slate-200 pt-6">
              <Link href="/tutorial" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Tutorial
              </Link>
            </div>
          </article>

          <aside>
            <div className="space-y-5 lg:sticky lg:top-24">
              <TutorialToc content={tutorial.content} />
              {contact ? (
                <div className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
                    Petugas Terkait
                  </p>
                  <h2 className="mt-2 text-base font-bold text-slate-900">
                    Butuh penjelasan lebih lanjut?
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Hubungi contact person bidang terkait tutorial ini.
                  </p>
                  <div className="mt-4">
                    <ContactCard
                      contact={contact}
                      divisionName={contact.division.name}
                      compact
                    />
                  </div>
                </div>
              ) : null}
              <div className="card p-5">
                <h2 className="text-base font-bold text-slate-900">
                  Tutorial Lainnya
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Materi lain dalam kategori {tutorial.category}.
                </p>
                {related.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Belum ada tutorial terkait lainnya.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {related.map((item) => (
                      <TutorialCard key={item.id} tutorial={item} compact />
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 p-5 ring-1 ring-primary-100">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-600">
                  Butuh bantuan?
                </p>
                <h2 className="mt-2 text-base font-bold text-slate-900">
                  Konsultasikan layanan kepada petugas
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Hubungi bidang terkait jika Anda memerlukan penjelasan lebih
                  lanjut mengenai tutorial ini.
                </p>
                <Link href="/kontak" className="btn-primary mt-4 w-full">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
