import { Film, PlayCircle } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { getVideoEmbedUrl, isDirectVideoUrl } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  title: string;
  autoPlay?: boolean;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
}: VideoPlayerProps) {
  const embedUrl = getVideoEmbedUrl(videoUrl);
  const directVideo = isDirectVideoUrl(videoUrl);
  const embedSrc =
    embedUrl && autoPlay
      ? `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`
      : embedUrl;

  if (embedSrc) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950 shadow-xl ring-1 ring-slate-200">
        <iframe
          src={embedSrc}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (directVideo && videoUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950 shadow-xl ring-1 ring-slate-200">
        <video
          className="h-full w-full"
          controls
          autoPlay={autoPlay}
          preload="metadata"
          poster={thumbnailUrl ?? undefined}
          aria-label={title}
        >
          <source src={videoUrl} />
          Browser Anda tidak mendukung pemutar video.
        </video>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-primary-950 shadow-xl ring-1 ring-slate-200">
      <SmartImage
        src={thumbnailUrl}
        alt={title}
        className="h-full w-full opacity-55"
        iconClassName="h-16 w-16 text-primary-200"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-950/60 px-6 text-center text-white">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-primary-950">
          {thumbnailUrl ? <PlayCircle className="h-7 w-7" /> : <Film className="h-7 w-7" />}
        </span>
        <p className="mt-4 text-base font-bold">Video Segera Hadir</p>
        <p className="mt-1 max-w-sm text-sm text-white/70">
          Admin dapat mengunggah video tutorial melalui panel admin.
        </p>
      </div>
    </div>
  );
}
