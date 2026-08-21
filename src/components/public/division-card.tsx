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
    <article className="card card-interactive group relative flex h-full flex-col overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-400 via-primary-500 to-primary-700" />
      <div className="flex items-start justify-between">
        <IconBadge name={division.icon} className="h-14 w-14 rounded-2xl" iconClassName="h-7 w-7" />
        {division.abbreviation ? (
          <Badge className="bg-primary-50 text-primary-700 ring-primary-200">
            {division.abbreviation}
          </Badge>
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-bold leading-snug text-slate-900">
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
      <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Wrench className="h-3.5 w-3.5 text-primary-600" />
        {division._count.services} layanan tersedia
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
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
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
