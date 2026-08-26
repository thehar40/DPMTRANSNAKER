import Link from "next/link";
import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-700 via-primary-400 to-accent-400"
      />
      <IconBadge
        name={service.icon}
        className="h-10 w-10 rounded-xl"
        iconClassName="h-5 w-5"
      />
      {service.division ? (
        <Link
          href={`/bidang/${service.division.slug}`}
          className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700 transition hover:bg-primary-100 hover:text-primary-800"
        >
          <Building2 className="h-3 w-3" />
          {service.division.name}
        </Link>
      ) : null}
      <h3 className="mt-2 text-base font-semibold leading-snug text-slate-900">
        <Link
          href={`/layanan/${service.slug}`}
          className="transition group-hover:text-primary-700"
        >
          {service.name}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">
        {service.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <Link
          href={`/layanan/${service.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Detail Layanan
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi WhatsApp untuk layanan ${service.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
