import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(
  date: Date | string | null | undefined,
  pattern = "d MMMM yyyy"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";
  return format(d, pattern, { locale: id });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function truncate(text: string, length = 140): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isValidExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
}

export function getVideoEmbedUrl(value: string | null | undefined): string | null {
  if (!value || !isValidExternalUrl(value)) return null;

  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const embedMatch = url.pathname.match(/^\/embed\/([^/]+)/);
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
      videoId = embedMatch?.[1] ?? shortsMatch?.[1] ?? url.searchParams.get("v") ?? "";
    } else if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const vimeoId = url.pathname.match(/\/(\d+)(?:$|\/)/);
      if (vimeoId?.[1]) return `https://player.vimeo.com/video/${vimeoId[1]}`;
    }

    if (/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    }
  } catch {
    return null;
  }

  return null;
}

export function isDirectVideoUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  const url = value.trim();
  if (/^\/uploads\/tutorials\/[A-Za-z0-9._/-]+$/i.test(url)) return true;
  return isValidExternalUrl(url) && /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url);
}

export function isValidMapUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return isValidExternalUrl(url) && /google\.com\/maps|openstreetmap/i.test(url);
}

export function hasValue(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v === "" || v === "#") return false;
  if (v.startsWith("[") && v.endsWith("]")) return false;
  if (v.includes("ganti dengan")) return false;
  return true;
}

export function toDateTimeLocalValue(
  date: Date | string | null | undefined
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
