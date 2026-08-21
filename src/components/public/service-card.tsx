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
    <article className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <IconBadge name={service.icon} />
      {service.division ? (
        <Link
          href={`/bidang/${service.division.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 hover:text-primary-800"
        >
          <Building2 className="h-3.5 w-3.5" />
          {service.division.name}
        </Link>
      ) : null}
      <h3 className="mt-1.5 text-base font-bold text-slate-900">
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
      <div className="mt-5 flex items-center justify-between">
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
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
