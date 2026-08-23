import { ExternalLink, MapPin } from "lucide-react";
import { getMapEmbedUrl, hasValue, isValidExternalUrl } from "@/lib/utils";

interface MapPreviewProps {
  url: string | null;
  location?: string | null;
  coordinates?: { lat: number; lon: number } | null;
  heightClass?: "h-64" | "h-80";
  dark?: boolean;
}

export function MapPreview({
  url,
  location,
  coordinates,
  heightClass = "h-64",
  dark = false,
}: MapPreviewProps) {
  const embedUrl = getMapEmbedUrl(url);
  const shareUrl = hasValue(url) && isValidExternalUrl(url) ? url!.trim() : null;
  const coordinatesEmbedUrl =
    !embedUrl && coordinates
      ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}&z=16&output=embed`
      : null;
  const addressEmbedUrl =
    !embedUrl && !coordinatesEmbedUrl && shareUrl && hasValue(location)
      ? `https://www.google.com/maps?q=${encodeURIComponent(location!.trim())}&output=embed`
      : null;
  const displayEmbedUrl = embedUrl ?? coordinatesEmbedUrl ?? addressEmbedUrl;

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${dark ? "border-white/15" : "border-slate-200"}`}>
      {displayEmbedUrl ? (
        <iframe
          src={displayEmbedUrl}
          title="Peta lokasi kantor dinas"
          className={`${heightClass} w-full`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div
          className={`flex ${heightClass} w-full flex-col items-center justify-center px-6 text-center ${
            dark ? "bg-primary-950/60 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? "bg-white/10 text-accent-300" : "bg-white text-primary-600 shadow-sm"}`}>
            <MapPin className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-bold">
            {shareUrl ? "Lokasi siap dibuka" : "Peta belum diatur"}
          </p>
          <p className={`mt-1 max-w-md text-xs leading-relaxed ${dark ? "text-white/60" : "text-slate-500"}`}>
            {shareUrl
              ? "URL yang dimasukkan adalah link berbagi Google Maps. Gunakan tombol di bawah untuk membuka lokasi, atau masukkan URL Embed agar peta tampil langsung."
              : "Masukkan URL Embed Google Maps pada menu Pengaturan admin agar peta tampil di halaman ini."}
          </p>
          {shareUrl ? (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 !px-4 !py-2 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Buka di Google Maps
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}
