import Link from "next/link";
import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";
import { truncate } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string | null;
    division: { name: string; slug: string } | null;
  };
  whatsapp?: string | null;
}

export function ServiceCard({ service, whatsapp }: ServiceCardProps) {
  const waLink = normalizePhoneNumber(whatsapp ?? "")
    ? buildWhatsAppLink(
        whatsapp ?? "",
        `Halo, saya ingin bertanya tentang layanan ${service.name}.`
      )
    : null;

  return (
    <article className="card card-interactive group relative flex h-full flex-col overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-700 via-primary-400 to-accent-400" />
      <IconBadge name={service.icon} className="h-14 w-14 rounded-2xl" iconClassName="h-7 w-7" />
      {service.division ? (
        <Link
          href={`/bidang/${service.division.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-100 hover:text-primary-800"
        >
          <Building2 className="h-3.5 w-3.5" />
          {service.division.name}
        </Link>
      ) : null}
      <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">
        <Link
          href={`/layanan/${service.slug}`}
          className="transition group-hover:text-primary-700"
        >
          {service.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {truncate(service.description, 120)}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/layanan/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Detail Layanan
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi WhatsApp untuk layanan ${service.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
