import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/ui/markdown";
import { TutorialCard } from "@/components/public/tutorial-card";
import { VideoPlayer } from "@/components/public/video-player";
import { getPublishedTutorials, getTutorialBySlug } from "@/lib/data";
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
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) notFound();

  const related = await getPublishedTutorials({
    category: tutorial.category,
    excludeId: tutorial.id,
    take: 3,
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-10 text-white">
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
            <VideoPlayer
              videoUrl={tutorial.videoUrl}
              thumbnailUrl={tutorial.thumbnailUrl}
              title={tutorial.title}
            />
            {tutorial.content ? (
              <div className="card mt-8 p-6 sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Tentang Tutorial Ini
                </h2>
                <Markdown content={tutorial.content} />
              </div>
            ) : null}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <Link href="/tutorial" className="btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Tutorial
              </Link>
            </div>
          </article>

          <aside>
            <div className="card sticky top-24 p-5">
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
                    <TutorialCard key={item.id} tutorial={item} />
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
