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
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
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
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400 text-primary-950 shadow-lg">
            <PlayCircle className="h-5 w-5" />
          </span>
          {tutorial.videoUrl ? "Tonton video" : "Video segera hadir"}
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
