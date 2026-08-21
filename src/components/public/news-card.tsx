import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Megaphone,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { NEWS_CATEGORY_STYLES } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Pengumuman: Megaphone,
  Kegiatan: CalendarDays,
  Layanan: FileText,
  Umum: Newspaper,
};

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: Date | null;
    division: { name: string; slug: string } | null;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const Icon = CATEGORY_ICONS[news.category] ?? Newspaper;

  return (
    <article className="card card-interactive group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <SmartImage
          src={news.coverImage}
          alt={news.title}
          className="h-44 w-full"
          iconClassName="h-12 w-12"
        />
        <Badge
          className={
            "absolute left-3 top-3 shadow-sm " +
            (NEWS_CATEGORY_STYLES[news.category] ??
              NEWS_CATEGORY_STYLES.Umum)
          }
        >
          <Icon className="h-3 w-3" />
          {news.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(news.publishedAt)}
          {news.division ? (
            <>
              <span aria-hidden="true">•</span>
              <span className="text-primary-600">{news.division.name}</span>
            </>
          ) : null}
        </p>
        <h3 className="mt-2 text-base font-bold leading-snug text-slate-900">
          <Link
            href={`/berita/${news.slug}`}
            className="line-clamp-2 transition group-hover:text-primary-700"
          >
            {news.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {truncate(news.excerpt, 120)}
        </p>
        <Link
          href={`/berita/${news.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Baca Selengkapnya
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
