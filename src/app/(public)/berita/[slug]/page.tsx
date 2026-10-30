import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/ui/markdown";
import { NewsCard } from "@/components/public/news-card";
import { NEWS_CATEGORY_STYLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getNewsBySlug, getPublishedNews } from "@/lib/data";
import { ImageSlider } from "@/components/public/image-slider";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const news = await getPublishedNews({ pageSize: 200 });
  return news.items.map((n) => ({ slug: n.slug }));
}

export const metadata: Metadata = {
  title: "Detail Berita",
  description:
    "Berita dan pengumuman Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) notFound();

  const related = await getPublishedNews({
    category: news.category,
    excludeId: news.id,
    pageSize: 3,
  });

  const allImages: string[] = [
    ...(news.coverImage ? [news.coverImage] : []),
    ...(Array.isArray(news.images) ? news.images : []),
  ].filter((url, idx, arr) => Boolean(url) && arr.indexOf(url) === idx);

  return (
    <div>
      <section className="page-header-grid py-10 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <Breadcrumb light items={[{ label: "Berita", href: "/berita" }, { label: news.category }]} />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge
              className={
                NEWS_CATEGORY_STYLES[news.category] ?? NEWS_CATEGORY_STYLES.Umum
              }
            >
              {news.category}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-white/80">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(news.publishedAt)}
            </span>
            {news.division ? (
              <Link
                href={`/bidang/${news.division.slug}`}
                className="flex items-center gap-1.5 text-xs text-accent-200 transition hover:text-accent-100"
              >
                <UserRound className="h-3.5 w-3.5" />
                {news.division.name}
              </Link>
            ) : null}
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
            {news.title}
          </h1>
        </div>
      </section>

      <div className="bg-slate-50 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            {/* Interactive Image or Slideshow with Lightbox */}
            {allImages.length > 0 && (
              <div className="mb-6">
                <ImageSlider
                  images={allImages}
                  alts={allImages.map((_, i) => `${news.title} (Gambar ${i + 1})`)}
                />
              </div>
            )}

            <p className="mt-6 rounded-r-2xl border-l-4 border-accent-400 bg-accent-50 px-5 py-4 text-sm font-medium italic leading-relaxed text-slate-700">
              {news.excerpt}
            </p>
            <div className="card mt-8 p-6 sm:p-8">
              <Markdown content={news.content} />
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <Link href="/berita" className="btn-secondary">
                Kembali ke Daftar Berita
              </Link>
            </div>
          </article>

          <aside aria-labelledby="berita-terkait-heading">
            <div className="card p-5">
              <h2
                id="berita-terkait-heading"
                className="text-base font-bold text-slate-900"
              >
                Berita Terkait
              </h2>
              {related.items.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Belum ada berita terkait lainnya.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {related.items.map((item) => (
                    <NewsCard key={item.id} news={item} />
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
