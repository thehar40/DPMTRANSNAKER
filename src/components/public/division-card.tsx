import Link from "next/link";
import { ArrowRight, MessageCircle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-400 via-primary-500 to-primary-700"
      />
      <div className="flex items-start justify-between">
        <IconBadge
          name={division.icon}
          className="h-10 w-10 rounded-xl"
          iconClassName="h-5 w-5"
        />
        {division.abbreviation ? (
          <Badge className="bg-primary-50 px-2 py-0.5 text-[11px] text-primary-700 ring-primary-200">
            {division.abbreviation}
          </Badge>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900">
        <Link
          href={`/bidang/${division.slug}`}
          className="transition group-hover:text-primary-700"
        >
          {division.name}
        </Link>
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">
        {division.description}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
        <Wrench className="h-3.5 w-3.5 text-primary-600" />
        {division._count.services} layanan tersedia
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <Link
          href={`/bidang/${division.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Lihat Bidang
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi ${division.name} via WhatsApp`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
