import Link from "next/link";
import { ArrowRight, MessageCircle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";
import { truncate } from "@/lib/utils";

interface DivisionCardProps {
  division: {
    id: number;
    name: string;
    slug: string;
    abbreviation: string | null;
    description: string;
    icon: string | null;
    _count: { services: number; contacts: number };
  };
  whatsapp?: string | null;
}

export function DivisionCard({ division, whatsapp }: DivisionCardProps) {
  const waLink = normalizePhoneNumber(whatsapp ?? "")
    ? buildWhatsAppLink(
        whatsapp ?? "",
        `Halo, saya ingin bertanya kepada ${division.name}.`
      )
    : null;

  return (
    <article className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <IconBadge name={division.icon} />
        {division.abbreviation ? (
          <Badge className="bg-primary-50 text-primary-700 ring-primary-200">
            {division.abbreviation}
          </Badge>
        ) : null}
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">
        <Link
          href={`/bidang/${division.slug}`}
          className="transition group-hover:text-primary-700"
        >
          {division.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {truncate(division.description, 130)}
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <Wrench className="h-3.5 w-3.5 text-primary-600" />
        {division._count.services} layanan tersedia
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <Link
          href={`/bidang/${division.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Lihat Bidang
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi ${division.name} via WhatsApp`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
