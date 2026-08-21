// Helper nomor WhatsApp.
// Contoh:
//   081234567890  -> 6281234567890
//   +6281234567890 -> 6281234567890
//   6281234567890 -> 6281234567890

export function normalizePhoneNumber(
  input: string | null | undefined
): string {
  const digits = (input ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function buildWhatsAppLink(
  number: string | null | undefined,
  text?: string
): string {
  const normalized = normalizePhoneNumber(number);
  if (!normalized) return "#";
  const url = new URL(`https://wa.me/${normalized}`);
  if (text && text.trim()) url.searchParams.set("text", text);
  return url.toString();
}
