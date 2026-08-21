import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";

export function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  const normalized = normalizePhoneNumber(whatsapp);
  if (!normalized) return null;

  const link = buildWhatsAppLink(
    whatsapp,
    "Halo, saya ingin bertanya tentang layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara."
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami melalui WhatsApp"
      title="Hubungi kami melalui WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition hover:scale-105 hover:bg-green-600"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
