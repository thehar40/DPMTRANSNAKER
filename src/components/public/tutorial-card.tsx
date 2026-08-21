import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { formatDate, truncate } from "@/lib/utils";

interface TutorialCardProps {
  tutorial: {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    duration: string | null;
    publishedAt: Date | null;
  };
  compact?: boolean;
  ribbon?: string;
}

export function TutorialCard({ tutorial, compact = false, ribbon }: TutorialCardProps) {
  if (compact) {
    return (
      <article className="group flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-lg">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
          <SmartImage
            src={tutorial.thumbnailUrl}
            alt={tutorial.title}
            className="h-full w-full"
            imgClassName="transition duration-500 group-hover:scale-105"
            iconClassName="h-6 w-6"
          />
          <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent-400 text-primary-950">
            <PlayCircle className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="min-w-0 py-0.5">
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-primary-600">
            {tutorial.category}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-primary-700">
            <Link href={`/tutorial/${tutorial.slug}`}>{tutorial.title}</Link>
          </h3>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>{formatDate(tutorial.publishedAt)}</span>
            {tutorial.duration ? <span>• {tutorial.duration}</span> : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card card-interactive group flex h-full flex-col overflow-hidden">
      <div className="relative overflow-hidden">
        <SmartImage
          src={tutorial.thumbnailUrl}
          alt={tutorial.title}
          className="aspect-video w-full"
          imgClassName="transition duration-500 group-hover:scale-105"
          iconClassName="h-12 w-12"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/55 via-transparent to-transparent" />
        <Badge className="absolute left-3 top-3 bg-white/90 text-primary-800 ring-white/70">
          {tutorial.category}
        </Badge>
        {ribbon ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-200 backdrop-blur">
            {ribbon}
          </span>
        ) : null}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400 text-primary-950 shadow-lg">
            <PlayCircle className="h-5 w-5" />
          </span>
          {tutorial.videoUrl ? "Tonton video" : "Video Segera Hadir"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(tutorial.publishedAt)}
          </span>
          {tutorial.duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {tutorial.duration}
            </span>
          ) : null}
        </div>
        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900">
          <Link
            href={`/tutorial/${tutorial.slug}`}
            className="transition group-hover:text-primary-700"
          >
            {tutorial.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {truncate(tutorial.description, 135)}
        </p>
        <Link
          href={`/tutorial/${tutorial.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          Lihat Tutorial
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
