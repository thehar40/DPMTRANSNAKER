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
